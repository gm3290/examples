import React from "react"
import { Modal } from "antd"
import i18n from "../../i18n"

const confirm = ({ onOk, RECOMMENDED }) => {
  Modal.confirm({
    onOk,
    icon: null,
    maskClosable: true,
    centered: true,
    title: i18n.t("notification.fileDimensions.title"),
    okButtonProps: {
      className: "RioButton primary",
    },
    cancelButtonProps: {
      type: "text",
      className: "RioButton",
    },
    okText: i18n.t("upload"),
    cancelText: i18n.t("cancel"),
    content: (
      <span
        dangerouslySetInnerHTML={{
          __html: i18n.t(
            "notification.fileDimensions.description",
            RECOMMENDED
          ),
        }}
      />
    ),
  })
}

export default confirm
