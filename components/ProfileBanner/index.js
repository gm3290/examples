import React, { useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import CopyToClipElement from "components/commons/CopyToClipElement"
import IconEdit from "components/commons/Icons/IconEdit"
import IconCopy from "components/commons/Icons/IconCopy"
import notify from "components/commons/notification"
import Spinner from "components/commons/Spinner"
import { updateUserAction } from "store/auth/actions"
import { updateTeamAction } from "store/team/actions"
import { formatAddress, formatFileSize, MB } from "helper/format"
import { getImageDimensions } from "helper/getExt"
import { uploadFileApi } from "api/media"
import confirm from "./confirm"

import "./styles.scss"

const MAX_SIZE = 10 * MB // 10Mb
const RECOMMENDED = {
  width: 1366,
  height: 175,
}

const ProfileBanner = ({
  username,
  isOwner,
  profilePicture,
  bannerPicture,
  publicAddress,
  viewComponent,
}) => {
  const inputRef = useRef()
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [updating, setUpdating] = useState(false)
  const isTeamProfile = viewComponent === "TeamProfile"

  const uploadFile = async (file) => {
    try {
      setUpdating(true)
      const { assetId } = await uploadFileApi(file)
      const payload = {
        banner: assetId,
        viewComponent,
        cb: () => {
          setUpdating(false)
        },
      }
      if (isTeamProfile) {
        dispatch(updateTeamAction(payload))
      } else {
        dispatch(updateUserAction(payload))
      }
    } catch (error) {
      notify({
        title: "Failed to upload file",
        desc: error?.response?.data?.error,
      })
    }
  }

  const handleChooseImage = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const handleChangeFile = async (evt) => {
    const [file] = evt.target.files
    inputRef.current.value = ""
    if (file) {
      const { size } = file
      try {
        const demensions = await getImageDimensions(file)
        if (size > MAX_SIZE) {
          notify({
            title: t("notification.fileSizeError.title"),
            desc: t("notification.fileSizeError.description", {
              fileSize: formatFileSize(MAX_SIZE),
            }),
          })
          return
        } else if (
          demensions.height !== RECOMMENDED.height ||
          demensions.width !== RECOMMENDED.width
        ) {
          confirm({
            onOk: () => {
              uploadFile(file)
            },
            RECOMMENDED,
          })
        } else {
          uploadFile(file)
        }
      } catch (error) {
        notify({
          title: t("notification.fileTypeError.title"),
          desc: t("notification.fileTypeError.description"),
        })
      }
    }
  }

  return (
    <div className="ProfileBannerContainer">
      <div className="ProfileBannerImage">
        {bannerPicture && <img src={bannerPicture} alt="" />}
        {isOwner && (
          <div
            role="presentation"
            className="EditBannerPic"
            onClick={handleChooseImage}
          >
            <IconEdit />
          </div>
        )}
      </div>
      <div className="ProfileInfo">
        <div className="ProfilePicture">
          <img src={profilePicture} alt="" />
        </div>
        <div className="ProfileUsername">{username}</div>
        {!isTeamProfile && publicAddress && (
          <CopyToClipElement content={publicAddress}>
            <div className="ProfilePublickAddress">
              <span>{formatAddress(publicAddress)}</span>
              <IconCopy />
            </div>
          </CopyToClipElement>
        )}
      </div>
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        name="bannerimage"
        onChange={handleChangeFile}
        className="BannerFilePicker"
      />
      {updating && <Spinner fullScreen />}
    </div>
  )
}

export default ProfileBanner
