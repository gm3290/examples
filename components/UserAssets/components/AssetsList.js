import React from "react"
import { isEmpty } from "lodash"
import NoResult from "components/commons/NoResult"
import AssetCard from "./AssetCard"

const AssetsList = ({ items, assetType, isOwner, loading }) => {
  if (loading) {
    return null
  }

  if (isEmpty(items)) {
    return <NoResult strPath={`profile.${assetType.key}`} onlyTitle />
  }

  return (
    <div className="AssetsGridList">
      {items.map((asset) => (
        <AssetCard key={asset.id} item={asset} isOwner={isOwner} />
      ))}
    </div>
  )
}

export default AssetsList
