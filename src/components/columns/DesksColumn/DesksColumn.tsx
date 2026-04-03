import "./DesksColumn.css";
import type { ColumnProps } from "../Column";
import Column from "../Column";
import { add } from "../../../assets/icons";
import { Button, DeskListItem, Skeleton } from "../../shared";
import { DeskType, NewDeskData, User } from "../../../types";
import { Discover, NewDesk } from "../../forms";
import { useModal } from "../../../hooks";
import { useAppDispatch, useDeskState } from "../../../app/hooks";

import {
  deskThunks,
  selectUserDesks,
  useUserDesks,
} from "../../../app/features/desk";
import { useSearch } from "../../../hooks/useSearch";
import SearchBar from "../../shared/SearchBar/SearchBar";
import { setError } from "../../../app/features/desk/slice";
import { INVALID_REQUEST } from "../../../constants/errors";

interface DesksColumnProps extends ColumnProps {
  selectedDeskId: string | null;
  onDeskClick: (deskId: string) => void;
  currentUser: User;
}

const DesksColumn = ({
  selectedDeskId,
  onDeskClick,
  currentUser,
  ...props
}: DesksColumnProps) => {
  const desks = useUserDesks(currentUser.uid);
  const dispatch = useAppDispatch();
  const { loading, fetchingDesks } = useDeskState();
  const { handleSearchChange, filteredData } = useSearch<DeskType>({
    dataSelector: (state) => selectUserDesks(state, currentUser.uid),
    searchKeys: ["name"],
  });
  const handleSubmit = async (data: NewDeskData) => {
    try {
      await dispatch(
        deskThunks.createDesk({
          creatorId: currentUser.uid,
          schoolId: currentUser.schoolId,
          isSchool: false,
          data,
        })
      ).unwrap();
      closeDiscoverModal();
      closeNewDeskModal();
    } catch (error) {}
  };
  const {
    modal: newDeskModal,
    closeModal: closeNewDeskModal,
    openModal: openNewDeskModal,
  } = useModal({
    title: "Create Desk",

    children: (
      <NewDesk
        isLoading={loading}
        onSubmit={(data) => handleSubmit(data as NewDeskData)}
      />
    ),
  });

  const handleDeskJoined = async (data: { desks: string[] }) => {
    if (!currentUser) {
      return dispatch(setError(INVALID_REQUEST));
    }
    const { desks: selectedDesks } = data;
    await Promise.all(
      selectedDesks.map((deskId) => {
        if (!desks.map((item) => item.id).includes(deskId)) {
          return dispatch(
            deskThunks.removeMember({ uid: currentUser.uid, deskId })
          ).unwrap();
        } else {
          return dispatch(
            deskThunks.addMember({ uid: currentUser.uid, deskId })
          ).unwrap();
        }
      })
    );
    closeDiscoverModal();
  };

  const {
    modal: discoverModal,
    openModal: openDiscoverModal,
    closeModal: closeDiscoverModal,
  } = useModal({
    description: `Select or create a Desk and click "Done" to be a part of the action!`,
    title: "Discover Desks",
    headerRight: (
      <Button onClick={openNewDeskModal} buttonType="text" appearance="primary">
        Create
      </Button>
    ),
    children: (
      <Discover
        isLoading={loading}
        onSubmit={(data) => handleDeskJoined(data as { desks: string[] })}
      />
    ),
  });

  const headerRight = (
    <Button
      onClick={openDiscoverModal}
      size={45}
      shape="circle"
      appearance="secondary"
      buttonType="icon"
      icon={add}
    />
  );
  if (fetchingDesks) {
    return (
      <Column {...props}>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Column>
    );
  }

  return (
    <Column headerRight={headerRight} title={"Desks"} {...props}>
      {discoverModal}
      {newDeskModal}

      <div className="desks-container">
        <div
          className="header"
          style={{
            zIndex: 999,
            position: "sticky",
            top: "-20%",
          }}
        >
          <SearchBar
            placeholder="Search Desks in your school"
            onChange={handleSearchChange}
          />
        </div>
        {desks.length === 0 && (
          <div className="flex-column centered-absolute">
            <p className="description">You don't have any desks yet.</p>
            <Button
              onClick={openDiscoverModal}
              iconSize={16}
              appearance="secondary"
              buttonStyle="shadow"
              shape="rounded"
            >
              Discover Desks
            </Button>
          </div>
        )}
        {filteredData.length > 0 && (
          <div style={{ padding: "1em" }} className="flex-column">
            {filteredData.map((desk, index) => (
              <DeskListItem
                onClick={() => {
                  onDeskClick(desk.id);
                }}
                style={{ margin: 0 }}
                selected={desk.id === selectedDeskId}
                key={index}
                desk={desk}
              />
            ))}
          </div>
        )}

        {desks.length > 0 && filteredData.length === 0 && (
          <div className="centered">
            <p
              className="description"
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              No results found. Try changing your search.{" "}
            </p>
          </div>
        )}
      </div>
    </Column>
  );
};

export default DesksColumn;
