import React from "react"
import { useTranslation } from "react-i18next"
import { countOfAssetsSelector } from "store/assets/selectors"
import { useSelector } from "react-redux"

import "./summary.scss"

const Summary = () => {
  const { t } = useTranslation()
  const { stations: numOfStations } = useSelector(countOfAssetsSelector)

  return (
    <div className="AssetsSummary">
      <div className="SummaryCol">
        <div className="value">{numOfStations}</div>
        <div className="label">{t("assets.summary.totalAssets")}</div>
      </div>
      <div className="SummaryCol">
        <div className="value">0.000 {t("riot")}</div>
        <div className="label">{t("assets.summary.earnFromStation")}</div>
      </div>
      <div className="SummaryCol">
        <div className="value">0.000 {t("riot")}</div>
        <div className="label">{t("assets.summary.earnFromLand")}</div>
      </div>
      <div className="SummaryCol">
        <div className="value">0.000 {t("riot")}</div>
        <div className="label">{t("assets.summary.availableTokens")}</div>
      </div>
    </div>
  )
}

export default Summary
