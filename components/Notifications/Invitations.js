import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { acceptInviteAction, rejectInviteAction } from "store/team/actions"
import { invitationSelector, userHasTeamSelector } from "store/team/selectors"
import RioButton from "components/commons/Button"
import userImg from "assets/images/user.png"
import teamImg from "assets/images/team.png"

const InvitationCard = ({ item, disableAccept }) => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()

  const handleReject = () => {
    dispatch(rejectInviteAction(item))
  }

  const handleAccpet = () => {
    dispatch(acceptInviteAction(item))
  }

  const teamPicture = item?.team?.team_picture?.uri || teamImg
  const ownerPicture = item?.team?.owner?.profile_picture?.uri || userImg
  const ownerName = item?.team?.owner?.username
  const teamName = item?.team?.title
  const teamId = item?.team?.id

  return (
    <div className="InvitationCard">
      <div className="TeamAndOwnerPicture">
        <Link to={`/teams/${teamId}`}>
          <img src={teamPicture} alt="team" className="TeamProfilePicture" />
          <img src={ownerPicture} alt="owner" className="OwnerProfilePicture" />
        </Link>
      </div>
      <div className="InvitaionDetail">
        <div
          className="InvitationDesc"
          dangerouslySetInnerHTML={{
            __html: t("notify.invitations.invitedesc", {
              owner: ownerName,
              team: teamName,
            }),
          }}
        />
        <div className="InvitationDate">
          {i18n.format(item.createdAt, "MMM DD, YYYY", i18n.language)}
        </div>
        <div className="Actions">
          <RioButton rounded bordered size="small" onClick={handleReject}>
            {t("notify.invitations.reject")}
          </RioButton>
          <RioButton
            rounded
            size="small"
            onClick={handleAccpet}
            disabled={disableAccept}
          >
            {t("notify.invitations.accept")}
          </RioButton>
        </div>
      </div>
    </div>
  )
}

const Invitations = () => {
  const invitations = useSelector(invitationSelector)
  const disableAccept = useSelector(userHasTeamSelector)
  return (
    <div className="InvitationsList">
      {invitations?.map((item) => (
        <InvitationCard
          key={item.id}
          item={item}
          disableAccept={disableAccept}
        />
      ))}
    </div>
  )
}

export default Invitations
