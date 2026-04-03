import { useEffect, useState } from "react";
import "./DeskItemColumn.css";
import { FilePreviewer, Profile } from "../..";
import { Column, ColumnProps } from "../";
import {
  chevron_left,
  chevron_right,
  close,
  down_arrow,
  down_arrow_o,
  download as downloadIcon,
  maximize,
  more,
  up_arrow,
  up_arrow_o,
} from "../../../assets/icons";
import {
  Button,
  EmptyDesk,
  ProfileButton,
  ProgressIndicator,
} from "../../shared";
import { useDropdown, useModal } from "../../../hooks";
import useDownloader from "../../../hooks/useDownloader";
import { getFormattedDate } from "../../../utils";
import { DeskItemFormData, DeskItemType, User } from "../../../types";
import { Confirmation, Contact, NewDeskItem } from "../../forms";
import { deskService } from "../../../services";
import useTransaction from "../../../hooks/useTransaction";
import { FormState } from "react-hook-form";
import { useNotification } from "../../../context";
import { ContactFormData } from "../../forms/Contact";
import { useAppDispatch, useDeskState } from "../../../app/hooks";
import { useUser } from "../../../app/features/user";

import {
  useCurrentDesk,
  useCurrentItem,
} from "../../../app/features/desk/hooks";
import { deskThunks } from "../../../app/features/desk";
import { setCurrentItemId, setError } from "../../../app/features/desk/slice";
import { DESK_ITEM_NOT_FOUND } from "../../../constants/errors";

interface DeskItemColumnProps extends ColumnProps {
  itemId: string | null;
  onDeskItemClick: (item: DeskItemType | null) => void;
  profileId: string | null;
  onProfileClick: (profileId: string | null) => void;
  currentUser: User;
}

enum DeskItemOptions {
  Edit = "Edit",
  Delete = "Delete",
  Report = "Report",
}

const DeskItemColumn = ({
  currentUser,
  itemId,
  onDeskItemClick,
  profileId,
  onCollapse,

  onProfileClick,
  ...props
}: DeskItemColumnProps) => {
  const [fileIndex, setFileIndex] = useState(0);
  const { download } = useDownloader();
  useNotification();
  const currentDesk = useCurrentDesk();
  const { loading } = useDeskState();
  const item = useCurrentItem();
  const { showError } = useTransaction();
  const creator = useUser(item?.creatorId);
  const dispatch = useAppDispatch();
  const {
    modal: editDeskItemModal,
    openModal: openEditDeskItemModal,
    closeModal: closeEditDeskItemModal,
  } = useModal({
    children: (
      <NewDeskItem
        mode="onSubmit"
        description="Edit your upload. Deleting a file will reset the download count and votes for that file."
        isLoading={loading}
        defaultValues={{ ...item }}
        onSubmit={(data, formState) =>
          handleDeskItemChange(
            data as DeskItemFormData,
            formState as FormState<DeskItemFormData>
          )
        }
      />
    ),
    title: "Edit Upload",
  });
  const {
    modal: deleteModal,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal({
    description:
      "If you are sure you want to delete this item, enter your password to confirm.",
    children: <Confirmation onSubmit={() => handleDeleteItem()} />,
    title: "Are you sure?",
  });
  const {
    modal: contactModal,
    openModal: openContactModal,
    closeModal: closeContactModal,
  } = useModal({
    description:
      "Does something look off to you? If so, let us know by reporting it.",
    children: (
      <Contact
        action="https://formspree.io/f/mpwwnzqz"
        method="POST"
        subject="Report"
        email={currentUser.email}
        onSubmit={(data) => handleContact(data as ContactFormData)}
      />
    ),
    title: "Report",
  });

  const handleDeskItemChange = async (
    data: DeskItemFormData,
    formState: FormState<DeskItemFormData>
  ) => {
    try {
      if (!item) {
        throw new Error(DESK_ITEM_NOT_FOUND);
      }
      const dirtyFiles = formState.dirtyFields.files;
      const { files } = data;
      const updatedData = {
        ...data,
        files,
      } as Partial<DeskItemFormData>;
      if (dirtyFiles?.length) {
        delete updatedData.files;
      }
      await dispatch(
        deskThunks.updateDeskItem({
          itemId: item.id,
          deskId: item.deskId,
          updatedData,
        })
      ).unwrap();
      closeEditDeskItemModal();
    } catch (error) {
      dispatch(setError(error));
    }
  };

  const handleDeskItemClick = (item: DeskItemType | null) => {
    onDeskItemClick(item);
    onProfileClick(null);
  };
  const handleContact = async (_: ContactFormData) => {
    closeContactModal();
  };
  const handleDeleteItem = async () => {
    if (!item) return;
    try {
      await deskService.deleteDeskItem(item.deskId, item.id);
      closeDeleteModal();
      dispatch(setCurrentItemId(null));
    } catch (error) {
      showError(error as Error);
    }
  };
  const changeFile = (index: number) => {
    if (!item) return;
    if (index < 0) {
      return setFileIndex(item.files.length - 1);
    }
    if (index > item.files.length - 1) {
      return setFileIndex(0);
    }
    setFileIndex(index);
  };

  const { dropdown: deskItemDropDown, showDropdown: showDeskItemDropdown } =
    useDropdown({
      onOptionClick(option) {
        switch (option) {
          case DeskItemOptions.Edit:
            openEditDeskItemModal();
            break;
          case DeskItemOptions.Delete:
            openDeleteModal();
            break;
          case DeskItemOptions.Report:
            openContactModal();
            break;
        }
      },
      options:
        creator?.uid && currentUser.uid === creator.uid
          ? [DeskItemOptions.Edit, DeskItemOptions.Delete]
          : [DeskItemOptions.Report],
    });
  const { dropdown: profileDropdown, showDropdown: showProfileDropdown } =
    useDropdown({
      onOptionClick(option) {
        switch (option) {
          case DeskItemOptions.Report:
            break;
        }
      },
      options:
        creator?.uid && currentUser.uid !== creator.uid
          ? [DeskItemOptions.Report]
          : [],
    });

  const handleDownload = async () => {
    if (!item || !currentDesk) return;
    try {
      await download(item.files[fileIndex].url);

      dispatch(
        deskThunks.downloadItem({
          deskId: currentDesk.id,
          itemId: item.id,
          uid: currentUser.uid,
          fileIndex,
        })
      ).unwrap();
    } catch (error) {
      showError(error as Error);
    }
  };

  const handleUpvote = () => {
    if (!item || !currentDesk) return;
    dispatch(
      deskThunks.upvoteItem({
        uid: currentUser.uid,
        deskId: currentDesk.id,
        itemId: item.id,
        fileIndex,
      })
    );
  };

  const handleDownvote = () => {
    if (!item || !currentDesk) return;
    dispatch(
      deskThunks.downvoteItem({
        uid: currentUser.uid,
        deskId: currentDesk.id,
        itemId: item.id,
        fileIndex,
      })
    );
  };

  useEffect(() => {
    const wrapper = document.getElementById("desk-item-wrapper");

    if (!wrapper) return;
    if (profileId !== null) {
      wrapper.style.transform = "translateX(-50%)";
    } else {
      wrapper.style.transform = "translateX(0)";
    }
  }, [profileId, itemId]);
  const handleProfileClick = () => {
    onProfileClick(creator?.uid || null);
  };
  const handleColumnClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (profileId !== null) {
      e.preventDefault(); //prevent the column from collapsing

      onProfileClick(null); //if the profile is open set profile to null
    } else {
      onCollapse && onCollapse(e); //propagate the collapse event
    }
  };

  if (loading) {
    return (
      <Column {...props}>
        <div className="centered">
          <ProgressIndicator />
        </div>
      </Column>
    );
  }

  if (!item && itemId)
    return (
      <Column toggleIcon={profileId ? chevron_left : close} {...props}>
        <EmptyDesk message="This Desk item does not exist." />
      </Column>
    );
  else if (!item) {
    return (
      <Column toggleIcon={profileId ? chevron_left : close} {...props}>
        <EmptyDesk message="Select a Desk item within the middle column to see its contents" />
      </Column>
    );
  }
  return (
    <Column
      toggleIcon={profileId ? chevron_left : close}
      title={
        profileId ? (
          //show the profile button if there is a profile
          // otherwise show the item title
          <ProfileButton
            style={{ margin: "20px 0 10px" }}
            size={35}
            showsName
            user={creator}
          />
        ) : (
          item.title
        )
      }
      headerRight={
        <Button
          shape="circle"
          icon={more}
          iconStyle={{ opacity: 1 }}
          size={40}
          buttonType="icon"
          onClick={
            profileId === null ? showDeskItemDropdown : showProfileDropdown
          }
        >
          {profileId === null ? deskItemDropDown : profileDropdown}
        </Button>
      }
      onCollapse={handleColumnClose}
      {...props}
    >
      {deleteModal}
      {contactModal}
      {editDeskItemModal}
      <div id="desk-item-wrapper">
        <div id="desk-item-container" className="desk-item-container">
          <div className="desk-item-header">
            <div onClick={handleProfileClick} className="user-btn">
              <ProfileButton
                style={{ margin: "20px 0 10px" }}
                size={35}
                onClick={handleProfileClick}
                showsName
                user={creator}
              />
            </div>
            <p>{getFormattedDate(new Date(item.createdAt))}</p>
          </div>

          {item.files && item.files.length ? (
            <div className="desk-item-body">
              <Button
                className="image-control"
                colorScheme="dark"
                shape="circle"
                appearance="ghost"
                buttonType="icon"
                icon={chevron_left}
                aria-label="View previous image"
                style={{
                  left: 10,
                  visibility: item.files.length > 0 ? "visible" : "hidden",
                }}
                onClick={() => changeFile(fileIndex - 1)}
              />

              <Button
                className="image-control"
                colorScheme="dark"
                shape="circle"
                appearance="ghost"
                buttonType="icon"
                icon={chevron_right}
                aria-label="View previous image"
                style={{
                  visibility: item.files.length > 0 ? "visible" : "hidden",
                  right: 10,
                }}
                onClick={() => changeFile(fileIndex - 1)}
              />
              <Button
                shape="circle"
                appearance="ghost"
                colorScheme="dark"
                className="image-control"
                onClick={() => window.open(item.files[fileIndex].url)}
                style={{
                  zIndex: 9,
                  top: 20,
                  right: 10,
                  position: "absolute",
                }}
                icon={maximize}
                buttonType="icon"
              />

              {item.files && (
                <FilePreviewer
                  onDownloadClick={handleDownload}
                  style={{ display: profileId !== null ? "none" : "block" }}
                  visible={true}
                  url={item.files[fileIndex].url}
                  filename={item.files[fileIndex].name}
                />
              )}
            </div>
          ) : (
            <div className="desk-item-body">
              <p className="description">There are no files in this upload</p>
            </div>
          )}
          <div className="desk-item-actions">
            <div className="vote-container">
              <Button
                onClick={handleUpvote}
                buttonType="icon"
                transparency="lighter"
                icon={
                  item.files[fileIndex].upvotes.includes(currentUser.uid)
                    ? up_arrow
                    : up_arrow_o
                }
              />
              <Button
                onClick={handleDownvote}
                buttonType="icon"
                size={20}
                transparency="lighter"
                icon={
                  item.files[fileIndex].downvotes.includes(
                    currentUser.uid || ""
                  )
                    ? down_arrow
                    : down_arrow_o
                }
              />
              <h6 className="vote-count">
                {item.files[fileIndex].upvotes?.length -
                  item.files[fileIndex].downvotes?.length || 0}{" "}
                Votes
              </h6>
            </div>
            <Button
              appearance="primary"
              shape="rounded"
              className="download-button"
              buttonType="icon-text"
              icon={downloadIcon}
              onClick={handleDownload}
              iconStyle={{ padding: 0 }}
              style={{ maxWidth: 200 }}
            >
              &nbsp;&nbsp;Download
            </Button>
          </div>
        </div>

        {profileId !== null && (
          <div className="profile-container">
            <Profile onDeskItemClick={handleDeskItemClick} user={creator} />
          </div>
        )}
      </div>
    </Column>
  );
};

export default DeskItemColumn;
