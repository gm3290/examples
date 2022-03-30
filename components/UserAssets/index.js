import React, { useState, useMemo } from "react"
import { ASSET_TYPE } from "constants/types"
import AssetsTabs from "./components/AssetsTabs"
import AssetsFilter from "./components/AssetsFilter"
import AssetsList from "./components/AssetsList"
import { sortOpts, getFilterOtps, getOrderedList } from "./helpers"

import "./styles.scss"

const UserAssets = ({ assets, loading, isOwner }) => {
  const [activeTab, setActiveTab] = useState(ASSET_TYPE.CAR)
  const assetByType = assets?.[activeTab.value] || []

  const filterOpts = useMemo(() => getFilterOtps(assetByType), [assetByType])
  const [sort, setSort] = useState(sortOpts[0])
  const [filter, setFilters] = useState(filterOpts[0])

  const handleChangeTab = (tab) => {
    setActiveTab(tab)
    setSort(sortOpts[0])
    setFilters(filterOpts[0])
  }

  const assetsToRender = getOrderedList(filter, sort, assetByType)

  return (
    <div className="AccountProfileAssets">
      <AssetsTabs activeTab={activeTab} setActiveTab={handleChangeTab} />
      <AssetsFilter
        count={assetByType?.length}
        type={activeTab.key}
        sort={sort}
        setSort={setSort}
        setFilters={setFilters}
        filter={filter}
        sortOpts={sortOpts}
        filterOpts={filterOpts}
      />
      <div className="ProfileAssetsTabView">
        <AssetsList
          loading={loading}
          isOwner={isOwner}
          assetType={activeTab}
          items={assetsToRender}
        />
      </div>
    </div>
  )
}

export default UserAssets
