import "./DeskColumn.css";
import { DeskItemType, DeskItemFormData } from "../../../types";
import type { ColumnProps } from "../Column";
import Column from "../Column";
import {
  Button,
  Desk,
  EmptyDesk,
  ProgressIndicator,
  Skeleton,
} from "../../shared";
import { useModal } from "../../../hooks";
import { NewDeskItem } from "../../forms";
import { add, hidden, trash, visible } from "../../../assets/icons";
import { User } from "../../../types";
import { useAppDispatch, useDeskState } from "../../../app/hooks";
import { deskThunks } from "../../../app/features/desk/";
import {
  useCurrentDesk,
  useCurrentDeskItems,
  useCurrentItemId,
} from "../../../app/features/desk/hooks";
import { useEffect } from "react";
import {
  setCurrentDeskId,
  setError,
  setSuccess,
} from "../../../app/features/desk/slice";
import { useSearch } from "../../../hooks/useSearch";
import { selectCurrentDeskItems } from "../../../app/features/desk/selectors";
import { DESK_NOT_FOUND } from "../../../constants/errors";

interface DeskColumnProps extends ColumnProps {
  currentUser: User;
  deskId: string | null;
  onDeskItemClick: (item: DeskItemType) => void;
}

const DeskColumn = ({
  currentUser,
  onDeskItemClick,
  deskId,
  ...props
}: DeskColumnProps) => {
  const dispatch = useAppDispatch();
  const items = useCurrentDeskItems();
  const { fetchingDeskItems, loading } = useDeskState();
  const desk = useCurrentDesk();
  const deskItems = useCurrentDeskItems();
  const currentItemId = useCurrentItemId();
  const { handleSearchChange, filteredData } = useSearch<DeskItemType>({
    dataSelector: selectCurrentDeskItems,
    searchKeys: ["title", "tag"],
  });
  const handleLeaveDesk = async () => {
    if (!desk) {
      return;
    }
    try {
      await dispatch(
        deskThunks.removeMember({ deskId: desk.id, uid: currentUser.uid })
      ).unwrap();
    } catch (error) {}
  };
  useEffect(() => {
    if (deskId) {
      dispatch(setCurrentDeskId(deskId));
    }
  }, [deskId]);
  const handleSubmit = async (data: DeskItemFormData) => {
    try {
      if (!deskId) {
        throw new Error(DESK_NOT_FOUND);
      }
      await dispatch(
        deskThunks.createDeskItem({
          deskId,
          creatorId: currentUser.uid,
          data,
          schoolId: currentUser.schoolId,
        })
      ).unwrap();
      closeDeskItemModal();
      dispatch(setSuccess("Desk item uploaded successfully"));
    } catch (error) {
      dispatch(setError((error as Error).message));
    }
  };
  const {
    modal: deskItemModal,
    openModal: openDeskItemModal,
    closeModal: closeDeskItemModal,
  } = useModal({
    description:
      "Upload a new Desk item. You can upload multiple files at once.",
    title: "New Upload",

    children: (
      <NewDeskItem
        isLoading={loading}
        onSubmit={(data) => handleSubmit(data as DeskItemFormData)}
      />
    ),
  });

  if (fetchingDeskItems) {
    return (
      <Column {...props}>
        <div className="centered">
          <ProgressIndicator />
        </div>
      </Column>
    );
  }

  if (!desk) {
    return (
      <Column title={""} {...props}>
        <EmptyDesk message="Select a Desk on the left to see it's contents" />
      </Column>
    );
  }
  const handleToggleDeskHidden = () => {
    dispatch(
      deskThunks.updateDesk({
        deskId: desk.id,
        updatedFields: { isHidden: !desk.isHidden },
      })
    );
  };
  const headerRight = (
    <div className="row">
      <Button
        size={45}
        onClick={handleToggleDeskHidden}
        icon={desk.isHidden ? hidden : visible}
      />
      <Button
        onClick={openDeskItemModal}
        icon={add}
        size={45}
        shape="circle"
        appearance="primary"
      />
    </div>
  );

  return (
    <Column
      title={desk.name}
      showsHeader={desk != null}
      headerRight={headerRight}
      {...props}
    >
      {deskItemModal}
      <Desk
        selectedItemId={currentItemId}
        onSearchChange={handleSearchChange}
        deskItems={deskItems}
        filteredItems={filteredData}
        desk={desk}
        onDeskItemClick={onDeskItemClick}
      />
      {/* if there are no items and the desk is not hidden show the add button. 
      If the desk was created by the current user also show the button */}
      {items?.length === 0 &&
        (!desk.isHidden || currentUser.uid === desk.creatorId) && (
          <Button
            onClick={openDeskItemModal}
            icon={add}
            style={{ marginBottom: 30 }}
            className="centered"
            buttonType="icon-text"
            shape="rounded"
            buttonStyle="shadow"
            appearance="ghost"
          >
            &nbsp; Add Something New!
          </Button>
        )}
      {desk.isHidden && currentUser.uid !== desk.creatorId && (
        <Button
          onClick={handleLeaveDesk}
          icon={trash}
          style={{ marginBottom: 30 }}
          iconSize={20}
          className="centered"
          buttonType="icon-text"
          shape="rounded"
          buttonStyle="shadow"
          appearance="danger"
        >
          &nbsp; Leave Desk
        </Button>
      )}
    </Column>
  );
};

export default DeskColumn;
