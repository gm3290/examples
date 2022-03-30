import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Dropdown, Menu } from "antd"
import IconSortDown from "components/commons/Icons/IconSortDown"
import IconSortUp from "components/commons/Icons/IconSortUp"
import IconTrigDown from "components/commons/Icons/IconTrigDown"
import IconFilter from "components/commons/Icons/IconFilter1"

const AssetsFilter = ({
  count,
  type,
  sort,
  filter,
  filterOpts,
  sortOpts,
  setSort,
  setFilters,
}) => {
  const [t, i18n] = useTranslation()

  const countText = useMemo(() => {
    if (!count) {
      return ""
    }

    return type === "cars"
      ? `${count} ${t(type)}`
      : `${count} ${t(`assets.${type}.title`)}`
  }, [count, type, i18n.language])

  const handlSort = ({ key }) => {
    if (sort.key === key) {
      if (!sort.direction || sort.direction === "asc") {
        setSort({ ...sort, direction: "des" })
      } else {
        setSort({ ...sort, direction: "asc" })
      }
    } else {
      const selected = sortOpts.find((op) => op.key === key)
      setSort({ ...selected, direction: "asc" })
    }
  }

  const handleClickSort = () => {
    if (sort.direction === "asc") {
      setSort({ ...sort, direction: "des" })
    } else {
      setSort({ ...sort, direction: "asc" })
    }
  }

  const handleClickFilter = ({ key }) => {
    setFilters(key)
  }

  const sortOverlay = (
    <Menu onClick={handlSort}>
      {sortOpts.map((op) => (
        <Menu.Item className={sort.key === op.key ? "active" : ""} key={op.key}>
          {t(`garage.${op.key}`)}
        </Menu.Item>
      ))}
    </Menu>
  )

  const filterOverlay = (
    <Menu onClick={handleClickFilter}>
      {filterOpts.map((op) => (
        <Menu.Item className={filter === op ? "active" : ""} key={op}>
          {op}
        </Menu.Item>
      ))}
    </Menu>
  )

  if (!count) {
    return null
  }

  return (
    <div className="ProfileAssetsFilter">
      <div className="AssetsCounts">{countText}</div>
      <div className="AssetsFilterAndSort">
        <div className="AssetsFilter">
          <Dropdown
            overlay={filterOverlay}
            trigger="click"
            disabled={!count}
            getPopupContainer={(triger) => triger.parentNode}
          >
            <div className="FilterButton">
              <IconFilter />
              <span className="selected heading3">
                {filter}
                <IconTrigDown />
              </span>
            </div>
          </Dropdown>
        </div>
        <div className="AssetsSort">
          <div className="FilterButton">
            <span role="presentation" onClick={handleClickSort}>
              {sort.direction === "asc" ? <IconSortDown /> : <IconSortUp />}
            </span>
            <Dropdown
              overlay={sortOverlay}
              trigger="click"
              disabled={!count}
              getPopupContainer={(triger) => triger.parentNode}
            >
              <span className="selected heading3">
                {t(`garage.${sort.key}`)}
                <IconTrigDown />
              </span>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetsFilter
