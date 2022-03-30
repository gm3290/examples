import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import AssetsApi from "api/assets"
import useMetaMaskAuth from "hooks/useMetaMaskAuth"
import CustomModal from "../commons/Modal"
import Input from "../commons/Input"
import notify from "../commons/notification"
import { ASSET_TYPE } from "constants/types"

import "./styles.scss"

const assetsApi = new AssetsApi()
const PAYMENT_STATUS = {
  READY: 0,
  PENDING: 1,
  SUCCESS: 2,
}

const ChangeAsset = ({
  onClose,
  name,
  assetId,
  amount = 0.3,
  assetType = ASSET_TYPE.CAR,
  // currentFlag = false,
}) => {
  const { t } = useTranslation()
  const { payNow } = useMetaMaskAuth()
  const [assetName, updateName] = useState("")
  const [errMsg, setErrMsg] = useState("")
  const [isSent, setIsSent] = useState(false)
  const [status, setStatus] = useState(PAYMENT_STATUS.READY)

  const updateNameRequest = async (transaction) => {
    try {
      const data = await assetsApi.updateAssetName(
        assetId,
        assetName,
        assetType.value.toLowerCase(),
        transaction
      )
      return data
    } catch (err) {
      notify({
        title: t(`assets.${assetType.key}.failedChangeName`),
        desc: err?.response?.data?.error,
      })
      return false
    }
  }

  const onPaymentStarted = async (transactionHash) => {
    setIsSent(true)
    const statusFlag = await updateNameRequest({ transactionHash })
    if (statusFlag) {
      notify({
        type: "success",
        title: t(`assets.${assetType.key}.updateName`),
        desc: (
          <>
            Payment transaction is pending ! <br />
            Asset name will be updated after confirmed your payment !
          </>
        ),
      })
      setStatus(PAYMENT_STATUS.PENDING)
      if (onClose) onClose()
    }
  }

  const onPayError = () => {
    setStatus(PAYMENT_STATUS.READY)
    notify({
      title: t(`assets.${assetType.key}.failedChangeName`),
      desc: "Payment wasn't successful",
    })
    if (onClose) onClose()
  }

  const onConfirm = async () => {
    if (name !== assetName && !isSent) {
      try {
        await assetsApi.checkAssetName(assetName, assetType.value.toLowerCase())
        payNow(amount, null, onPayError, onPaymentStarted)
      } catch (error) {
        setErrMsg(t(`assets.${assetType.key}.nameExist`))
      }
    }
  }

  useEffect(() => {
    updateName(name)
  }, [name])

  return (
    <CustomModal
      visible
      footer
      title={t(`assets.${assetType.key}.updateName`)}
      onCancel={onClose}
      onConfirm={status === PAYMENT_STATUS.READY ? onConfirm : null}
      confirmLabel="payAndSave"
      className="CarNameChangeModal"
    >
      <Input
        type="text"
        label={t("garage.name")}
        name="carName"
        value={assetName || ""}
        error={errMsg}
        onChange={(e) => updateName(e.target.value)}
        onFocus={() => setErrMsg("")}
      />
    </CustomModal>
  )
}

export default ChangeAsset
