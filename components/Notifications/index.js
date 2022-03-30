import React, { useEffect, useState } from "react"
import { Drawer } from "antd"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import { isAuthorizedSelector } from "store/auth/selectors"
import { hasNotifications } from "store/common/selectors"
import { loadInvitationsAction } from "store/team/actions"
import IconEmailOpen from "components/commons/Icons/IconEmailOpen"
import IconClose from "components/commons/Icons/IconClose"
import Invitations from "./Invitations"

import "./styles.scss"

const Notifications = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const isAuthorized = useSelector(isAuthorizedSelector)
  const userHasNotifications = useSelector(hasNotifications)

  useEffect(() => {
    if (isAuthorized) {
      dispatch(loadInvitationsAction())
    }
  }, [isAuthorized])

  const toggleDrawer = () => {
    setIsOpen(!isOpen)
  }

  if (!userHasNotifications) {
    return null
  }

  return (
    <div className="RioNotifications ml20">
      <div className="IconWapper" onClick={toggleDrawer}>
        <IconEmailOpen />
      </div>
      <Drawer
        width={380}
        placement="right"
        visible={isOpen}
        onClose={toggleDrawer}
        title={t("notify.title")}
        closeIcon={<IconClose />}
      >
        <Invitations />
      </Drawer>
    </div>
  )
}

export default Notifications
