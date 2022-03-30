import React, { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import { uploadFileApi } from "api/media"
import RioModal from "components/commons/Modal"
import RioButton from "components/commons/Button"
import notify from "components/commons/notification"
import RioInput from "components/commons/Input"
import Spinner from "components/commons/Spinner"
import { MEDIUM_MOBILE } from "constants/breakPoints"
import useWindowDimensions from "hooks/useWindowDimensions"
import { teamSelector } from "store/team/selectors"
import { createTeamAction, updateTeamAction } from "store/team/actions"

import TeamPicture from "components/commons/TeamPicture"

const CreateTeam = ({ onClose, isEditTeam }) => {
  const { t } = useTranslation()
  const inputRef = useRef()
  const dispatch = useDispatch()
  const team = useSelector(teamSelector)
  const [tempUri, setTempUri] = useState()
  const [teamName, setTeamName] = useState()
  const [pictureId, setTeamPicture] = useState(null)
  const [uploading, setUploading] = useState(false)
  const { width } = useWindowDimensions()
  const isMobile = width <= MEDIUM_MOBILE

  const handleChangeInput = (e) => {
    setTeamName(e.target.value)
  }

  const handleChooseImage = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const uploadFile = async (file) => {
    try {
      setUploading(true)
      const { assetId } = await uploadFileApi(file)
      setTeamPicture(assetId)
    } catch (error) {
      notify({
        title: "Failed to upload file",
        desc: error?.response?.data?.error,
      })
    } finally {
      setUploading(false)
    }
  }

  const handleChangeFile = (evt) => {
    const [file] = evt.target.files
    if (file) {
      uploadFile(file)
      setTempUri(URL.createObjectURL(file))
      inputRef.current.value = ""
    }
  }

  const handleSubmit = () => {
    const params = {
      title: teamName,
      picture: pictureId,
    }
    if (isEditTeam) {
      dispatch(updateTeamAction(params))
    } else {
      dispatch(createTeamAction(params))
    }
  }

  useEffect(() => {
    if (isEditTeam && team) {
      setTeamName(team.title)
      setTeamPicture(team.picture)
    }
  }, [team, isEditTeam])

  return (
    <RioModal
      visible
      isFull={isMobile}
      className="CreateTeamModal"
      onCancel={onClose}
    >
      <div className="CreateTeamForm">
        <TeamPicture
          vertical
          onClick={handleChooseImage}
          teamPictureUri={tempUri}
          btnText={
            pictureId === null && !isEditTeam
              ? t("team.addTeamIcon")
              : t("team.changeTeamIcon")
          }
        />
        <RioInput
          value={teamName}
          label={t("team.teamName")}
          onChange={handleChangeInput}
        />
        <RioButton
          rounded
          className="CreateTeamButton"
          onClick={handleSubmit}
          disabled={!teamName}
        >
          {isEditTeam ? t("common.save") : t("common.create")}
        </RioButton>
        <input
          type="file"
          ref={inputRef}
          accept="image/*"
          onChange={handleChangeFile}
        />
        {uploading && <Spinner fullScreen />}
      </div>
    </RioModal>
  )
}

export default CreateTeam
