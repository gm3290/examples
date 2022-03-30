import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import { MainWrapper } from "components/commons"
import ClubLevel from "components/commons/ClubLevel"
import { getClubAction } from "store/club/club"
import { getClubLevels } from "store/club/selectors"

import "./styles.scss"

const OwnerClub = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const levels = useSelector(getClubLevels)

  useEffect(() => {
    dispatch(getClubAction())
  }, [])

  return (
    <MainWrapper title={t("ownersclub.pageTitle")}>
      <div className="RiotOwnerClubLevelCard">
        {levels.map((level) => (
          <ClubLevel key={level.id} level={level.level} item={level} />
        ))}
      </div>
    </MainWrapper>
  )
}

export default OwnerClub
