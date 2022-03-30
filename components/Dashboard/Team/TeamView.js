import React, { useCallback, useMemo, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import i18n from "../../../i18n"
import { Modal } from "antd"
import TeamPicture from "components/commons/TeamPicture"
import IconEdit from "components/commons/Icons/IconEdit"
import IconButton from "components/commons/Button/IconButton"
import IconTrash from "components/commons/Icons/IconTrash"
import RioButton from "components/commons/Button"
import UserSearch from "components/commons/UserSearch"
import IconOut from "components/commons/Icons/IconOut"
import { teamMembersSelector, isTeamOwnerSelector } from "store/team/selectors"
import {
  inviteUserAction,
  removeTeamAction,
  leaveTeamAction,
} from "store/team/actions"

import TeamMember from "./TeamMember"
import TeamForm from "./TeamForm"

const confirm = ({ onClickOk, strPath, ...rest }) => {
  Modal.confirm({
    onOk: onClickOk,
    maskClosable: true,
    centered: true,
    icon: null,
    title: i18n.t(`notification.${strPath}.title`),
    okButtonProps: {
      className: "RioButton primary",
    },
    cancelButtonProps: {
      type: "text",
      className: "RioButton primary bordered",
    },
    okText: i18n.t("common.confirm"),
    cancelText: i18n.t("common.cancel"),
    content: i18n.t(`notification.${strPath}.description`),
    ...rest,
  })
}

const TeamView = ({ teamId }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const dispatch = useDispatch()
  const members = useSelector(teamMembersSelector)
  const isOwner = useSelector(isTeamOwnerSelector)
  const [user, setUser] = useState()
  const [isEdit, setIsEdit] = useState(false)

  const disableSendInvite = members?.length >= 20 || !isOwner

  const toggleEditTeamModal = () => {
    setIsEdit(!isEdit)
  }

  const removeTeam = () => {
    confirm({
      onClickOk: () => {
        dispatch(removeTeamAction())
      },
      strPath: "confirmRemoveTeam",
    })
  }

  const sendInvite = () => {
    if (user?.username && !disableSendInvite) {
      dispatch(inviteUserAction(user.username))
    }
    setUser()
  }

  const leaveTeam = useCallback(() => {
    confirm({
      onClickOk: () => {
        dispatch(leaveTeamAction())
      },
      width: 450,
      strPath: "confirmLeaveTeam",
    })
  }, [])

  const teamPicProps = useMemo(() => {
    if (isOwner) {
      return {
        teamId,
        showTitle: true,
      }
    }
    return {
      teamId,
      showTitle: true,
      onClick: leaveTeam,
      btnText: (
        <span className="LeaveTeamIconWrapper">
          <IconOut />
          {t("team.leaveTeam")}
        </span>
      ),
      buttonClassName: "LeaveTeamButton",
    }
  }, [language, isOwner, teamId])

  return (
    <div className="TeamPageContent">
      <div className="TeamPropertyRow">
        <div className="TeamPropertyContent">
          <TeamPicture {...teamPicProps} />
          {isOwner && (
            <IconButton
              favBtn
              className="mlr20"
              icon={<IconEdit />}
              onClick={toggleEditTeamModal}
            />
          )}
          {isOwner && (
            <IconButton icon={<IconTrash />} favBtn onClick={removeTeam} />
          )}
        </div>
      </div>
      {!disableSendInvite && (
        <div className="TeamPropertyRow">
          <div className="TeamPropertyName">{t("team.addPeople")}</div>
          <div className="TeamPropertyContent">
            <UserSearch onSelect={setUser} selected={user} />
            <RioButton
              rounded
              disabled={!user}
              onClick={sendInvite}
              className="InvitePeopleToTeam"
            >
              {t("team.sendInvite")}
            </RioButton>
          </div>
        </div>
      )}
      {members?.length > 0 && (
        <div className="TeamPropertyRow">
          <div className="TeamPropertyName">
            {t("team.membersInTeam", { count: members.length })}
          </div>
          <div className="TeamPropertyContent">
            <div className="TeamMemberGrid">
              {members.map((member) => (
                <TeamMember
                  item={member}
                  key={member.userId}
                  isOwner={isOwner}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {isEdit && <TeamForm isEditTeam onClose={toggleEditTeamModal} />}
    </div>
  )
}

export default TeamView
