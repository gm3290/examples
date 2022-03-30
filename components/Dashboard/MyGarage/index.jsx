import React from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { MainWrapper } from "components/commons"
import { loadingSelector } from "store/assets/selectors"
import CarsTab from "./CarsTab"

import "./styles.scss"

const MyGarage = () => {
  const { t } = useTranslation()
  const loading = useSelector(loadingSelector)

  return (
    <MainWrapper
      title={t("garage.pageTitle")}
      className="RioGarage"
      loading={loading}
    >
      <CarsTab />
    </MainWrapper>
  )
}

export default MyGarage
