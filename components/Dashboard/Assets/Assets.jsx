import React, { useEffect, useState } from "react"
import { isEmpty } from "lodash"
import { useSelector, useDispatch } from "react-redux"
import AssetCard from "components/commons/Card/StationCard"
import Spinner from "components/commons/Spinner"
import NoResult from "components/commons/NoResult"

import { getAssetsByEthReqAction } from "store/assets/actions"
import { getAssetsSelector } from "store/assets/selectors"

const Stations = ({ assetType }) => {
  const dispatch = useDispatch()
  const { loading, ...assetState } = useSelector(getAssetsSelector)
  const [assets, setAssets] = useState([])

  useEffect(() => {
    if (isEmpty(assetState[assetType.key])) {
      dispatch(getAssetsByEthReqAction(assetType))
    }
  }, [assetType])

  useEffect(() => {
    const newAssets = assetState[assetType.key]
    if (!isEmpty(newAssets)) {
      setAssets(newAssets?.rows)
    }
  }, [assetState])

  const clickShopNow = () => {
    window.open(`https://opensea.io/collection/${assetType.slug}`, "_blank")
  }

  if (loading) {
    return <Spinner />
  }

  if (isEmpty(assets)) {
    return (
      <NoResult strPath={`assets.${assetType.key}`} onClick={clickShopNow} />
    )
  }

  return (
    <div className="StationsGrid">
      {assets.map((asset, index) => (
        <AssetCard
          key={index}
          assetId={asset.assetId}
          assetType={assetType}
          name={asset.name}
          uri={asset.image}
          priceForName={asset?.priceForName}
          tokens={asset.tokens || 0}
        />
      ))}
    </div>
  )
}

export default Stations
