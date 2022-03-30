import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"
import { Tooltip } from "antd"
import { MainWrapper } from "components/commons"
import TagButton from "components/commons/Button/TagButton"
import RioButton from "components/commons/Button"

import AssetList from "./Assets"
import Summary from "./Summary"
import { ASSET_TYPE } from "constants/types"
import "./styles.scss"

const Assets = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const [activeTab, setActiveTab] = useState(ASSET_TYPE.STATION)

  const handleClickClaim = () => {
    history.push("/dashboard/wallet")
  }

  const title = (
    <>
      {t("assets.pageTitle")}
      <Tooltip title={t("comingSoon")}>
        <span className="DisabledTooltipWrapper">
          <RioButton
            className="AssetsClaimTokenBtn"
            onClick={handleClickClaim}
            disabled
          >
            {t("claim-tokens")}
          </RioButton>
        </span>
      </Tooltip>
    </>
  )

  return (
    <MainWrapper title={title} className="AssetsContainer">
      <Summary />
      <div className="AssetsTabs">
        <TagButton
          label={t("assets.stations.title")}
          actived={activeTab.key === ASSET_TYPE.STATION.key}
          onClick={() => setActiveTab(ASSET_TYPE.STATION)}
        />
        <TagButton
          label={t("assets.lands.title")}
          actived={activeTab.key === ASSET_TYPE.LAND.key}
          onClick={() => setActiveTab(ASSET_TYPE.LAND)}
        />
        <TagButton
          label={t("assets.shops.title")}
          actived={activeTab.key === ASSET_TYPE.SHOP.key}
          onClick={() => setActiveTab(ASSET_TYPE.SHOP)}
        />
        <TagButton
          label={t("assets.billboardlands.title")}
          actived={activeTab.key === ASSET_TYPE.BILLBOARD.key}
          onClick={() => setActiveTab(ASSET_TYPE.BILLBOARD)}
        />
      </div>
      <div className="AssetsTabView">
        <AssetList assetType={activeTab} />
      </div>
    </MainWrapper>
  )
}

export default Assets
