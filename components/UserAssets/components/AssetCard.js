import React, { useMemo, useState } from "react"
import { useSelector } from "react-redux"
import RioCard from "components/commons/Card/RioCard"
import { Spin } from "antd"
import MediaPlayer from "components/commons/Media"
import IconButton from "components/commons/Button/IconButton"
import EditIcon from "components/commons/Icons/IconEdit"
import ChangeAssetForm from "components/ChangeAssetName"
import { getUserSelector } from "store/auth/selectors"

import { ASSET_TYPE } from "constants/types"
import { isEmpty } from "lodash"

const AssetCard = ({ item, isOwner }) => {
  const [isOpen, openAssetForm] = useState(false)
  const user = useSelector(getUserSelector)

  const [cardClass, assetType, mediaProps, footerContent] = useMemo(() => {
    const className =
      item.assetType === "CryptoWhip"
        ? "RioCardContent CryptoWhip"
        : "CryptoWhip"

    const itemType = Object.values(ASSET_TYPE).find(
      ({ value }) => value.toLowerCase() === item.assetType.toLowerCase()
    )

    const mProps = {
      url: item.animation_url,
      previewUrl: item?.image,
    }

    const footer = isOwner ? (
      <div className="RioCardFooter">
        <div className="AssetName">
          <span>
            {item.assetType !== "CryptoWhip" && `#${item.assetId} `}
            {item.name}
          </span>

          {item?.tempName && item?.tempName !== item.name ? (
            <Spin className="name-loader" />
          ) : (
            !isEmpty(user?.publicAddress) && (
              <IconButton
                size="small"
                className="animation"
                icon={<EditIcon />}
                onClick={openAssetForm}
              />
            )
          )}
        </div>
      </div>
    ) : (
      <div className="RioCardFooter">
        <div className="AssetName">
          <span>
            {item.assetType !== "CryptoWhip" && `#${item.assetId} `}
            {item.name}
          </span>
        </div>
      </div>
    )

    return [className, itemType, mProps, footer]
  }, [item, isOwner])

  return (
    <RioCard>
      <div className={cardClass}>
        <MediaPlayer {...mediaProps} />
      </div>
      {footerContent}
      {isOpen && (
        <ChangeAssetForm
          name={item.name}
          amount={item?.priceForName}
          assetId={item.assetId}
          assetType={assetType}
          onClose={() => openAssetForm(false)}
        />
      )}
    </RioCard>
  )
}

export default AssetCard
