import React from "react"
import { useTranslation } from "react-i18next"
import TagButton from "components/commons/Button/TagButton"
import { ASSET_TYPE } from "constants/types"

const AssetsTabs = ({ activeTab, setActiveTab }) => {
  const [t] = useTranslation()

  return (
    <div className="ProfileAssetsTabs">
      <TagButton
        label={t("cars")}
        actived={activeTab.key === ASSET_TYPE.CAR.key}
        onClick={() => setActiveTab(ASSET_TYPE.CAR)}
      />
      <TagButton
        label={t("assets.stations.title")}
        actived={activeTab.key === ASSET_TYPE.STATION.key}
        onClick={() => setActiveTab(ASSET_TYPE.STATION)}
      />
      <TagButton
        label={t("assets.shops.title")}
        actived={activeTab.key === ASSET_TYPE.SHOP.key}
        onClick={() => setActiveTab(ASSET_TYPE.SHOP)}
      />
      <TagButton
        label={t("assets.lands.title")}
        actived={activeTab.key === ASSET_TYPE.LAND.key}
        onClick={() => setActiveTab(ASSET_TYPE.LAND)}
      />
      <TagButton
        label={t("assets.cryptowhips.title")}
        actived={activeTab.key === ASSET_TYPE.CRYPTOWHIP.key}
        onClick={() => setActiveTab(ASSET_TYPE.CRYPTOWHIP)}
      />
    </div>
  )
}

export default AssetsTabs
