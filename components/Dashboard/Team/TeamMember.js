import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import TeamMemberCard from "components/commons/Card/TeamMember"
import IconButton from "components/commons/Button/IconButton"
import IconTrash from "components/commons/Icons/IconTrash"
import IconDeclined from "components/commons/Icons/IconDeclined"
import IconEmailOpen from "components/commons/Icons/IconEmailOpen"
import { getUserIdSelector } from "store/auth/selectors"
import { removeMemberAction } from "store/team/actions"
import defaultImage from "assets/images/user.png"
import { formatAddress } from "helper/format"

const TeamMember = ({ item, isOwner }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const currentUserId = useSelector(getUserIdSelector)

  const { details, owner, userId, status } = item
  const memberUri = details?.profile_picture?.uri || defaultImage
  const isCurrentUser = currentUserId === userId
  const isAccepted = status === "accepted"
  const isRejected = status === "rejected"

  const removeMember = () => {
    dispatch(removeMemberAction(item))
  }

  const statusText = useMemo(() => {
    if (owner) {
      return "team.captain"
    }
    if (status === "accepted") {
      return "team.member"
    }
    if (status === "rejected") {
      return "team.declined"
    }
    return "team.pending"
  }, [owner, status])

  return (
    <TeamMemberCard>
      <div className="MemberCardContent">
        <div className="MeberCardBody">
          <div className="MemberPicture">
            <img src={memberUri} alt="" />
            {!isAccepted && !isRejected && (
              <div className="MemberNotAccepted">
                <IconEmailOpen />
              </div>
            )}
            {isRejected && (
              <div className="MemberNotAccepted Rejected">
                <IconDeclined />
              </div>
            )}
          </div>
          <div className="MemberCardDetail">
            <div className="MemberCardTitle">{details?.username}</div>
            <div className="MemberCardDesc">
              {formatAddress(details?.publicAddress, 7, 8)}
            </div>
          </div>
        </div>
        <div className="MeberCardFooter">
          <div>{t(statusText)}</div>
          <div>
            {isCurrentUser
              ? t("common.you")
              : isOwner && (
                  <IconButton icon={<IconTrash />} onClick={removeMember} />
                )}
          </div>
        </div>
      </div>
    </TeamMemberCard>
  )
}

export default TeamMember
