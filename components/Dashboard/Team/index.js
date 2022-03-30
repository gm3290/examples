import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import { MainWrapper } from "components/commons"
import NoResult from "components/commons/NoResult"
import { isLoadingTeamSelector, teamSelector } from "store/team/selectors"
import { loadTeamAction } from "store/team/actions"

import TeamForm from "./TeamForm"
import TeamView from "./TeamView"

import "./styles.scss"

const Team = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const loading = useSelector(isLoadingTeamSelector)
  const team = useSelector(teamSelector)
  const [isOpen, setIsOpen] = useState(false)

  const hasNoTeam = !loading && !team

  const toggleCreateTeam = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    dispatch(loadTeamAction())
  }, [])

  return (
    <MainWrapper title={t("team.pageTitle")} className="TeamPage">
      {hasNoTeam && (
        <NoResult
          strPath="team"
          onClick={toggleCreateTeam}
          buttonText={t("team.newButtonText")}
        />
      )}
      {team && <TeamView teamId={team.id} />}
      {isOpen && hasNoTeam && <TeamForm onClose={toggleCreateTeam} />}
    </MainWrapper>
  )
}

export default Team
