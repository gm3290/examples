import React, { useState, useEffect, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { isEmpty } from "lodash"
import { Dropdown, Menu, Pagination } from "antd"
import { useHistory } from "react-router-dom"
import { setActiveCarReqAction } from "store/assets/actions"
import { getAssetsSelector } from "store/assets/selectors"
import { getUserSelector } from "store/auth/selectors"
import TagButton from "components/commons/Button/TagButton"
import CarCard from "components/commons/Card/CarCard"
import NoResult from "components/commons/NoResult"
import IconSortUp from "components/commons/Icons/IconSortUp"
import IconSortDown from "components/commons/Icons/IconSortDown"
import IconTrigDown from "components/commons/Icons/IconTrigDown"
import { getFitlerList, getOrderedList } from "./utils"

const CarsTab = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()
  const sortOpts = useMemo(
    () => [
      {
        key: "name",
        label: t("garage.name"),
        direction: "asc",
      },
      {
        key: "experiencePoints",
        label: t("garage.xp"),
        direction: "asc",
      },
      {
        key: "carRating",
        label: t("garage.rating"),
        direction: "asc",
      },
      {
        key: "modelFactory",
        label: t("garage.model"),
        direction: "asc",
      },
    ],
    [i18n.language]
  )
  const [sort, setSort] = useState(sortOpts[0])
  const { id: userId } = useSelector(getUserSelector)
  const {
    selectedCar,
    cars: gargages,
    cryptowhips,
  } = useSelector(getAssetsSelector)

  const [page, setPage] = useState(1)
  const [cars, setCars] = useState([])
  const [carType, setCarType] = useState("all")

  const showDetail = (carId, assetType = "Car") => {
    history.push(`/detail/${assetType}/${carId}`)
  }

  const handleSelectCar = (carId) => {
    dispatch(setActiveCarReqAction({ carId, userId }))
  }

  const handlSort = ({ key }) => {
    setPage(1)
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

  const clickShopNow = () => {
    window.open("https://opensea.io/collection/riot-racers-cars", "_blank")
  }

  const handleClickSort = () => {
    if (sort.direction === "asc") {
      setSort({ ...sort, direction: "des" })
    } else {
      setSort({ ...sort, direction: "asc" })
    }
  }

  useEffect(() => {
    if (gargages) {
      setCars(gargages?.rows)
    }
  }, [gargages, selectedCar])

  useEffect(() => {
    // TODO: Need to update scrollbar component
    document
      ?.querySelector(".scrollbar-container.DashboardContent")
      ?.scrollTo(0, 20)
  }, [page])

  const [items, pageItems, filterOpts] = useMemo(() => {
    const filterQuery =
      carType === "CryptoWhip"
        ? {
            carType: "all",
            sorts: [sort],
            list: cryptowhips?.rows,
          }
        : {
            carType,
            sorts: [sort],
            list: cars,
          }
    const updated = getOrderedList(filterQuery)
    const pageItemList = updated.slice(9 * (page - 1), 12 * page)
    const filterItems = getFitlerList(cars)

    return [updated, pageItemList, filterItems]
  }, [carType, sort, cars, page])

  const sortToRender = sortOpts.find((op) => op.key === sort.key)

  const sortOverlay = (
    <Menu onClick={handlSort}>
      {sortOpts.map((op) => (
        <Menu.Item className={sort.key === op.key ? "active" : ""} key={op.key}>
          {op.label}
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    <div className="RioCars">
      <div className="CarFilterOptions">
        {filterOpts.map(
          (op, index) =>
            op.value && (
              <TagButton
                key={index}
                label={op.label}
                actived={carType === op.value}
                onClick={() => {
                  setPage(1)
                  setCarType(op.value)
                }}
              />
            )
        )}
        <TagButton
          label="CryptoWhips"
          actived={carType === "CryptoWhip"}
          onClick={() => {
            setPage(1)
            setCarType("CryptoWhip")
          }}
        />
      </div>

      <div className="CarSortContainer">
        {items?.length > 0 && (
          <div className="subtitle2">
            {items?.length} {t("cars")}
          </div>
        )}

        {!items.length && <div className="subtitle2">No Cars to show</div>}

        <div className="SortButton">
          <span role="presentation" onClick={handleClickSort}>
            {sort.direction === "asc" ? <IconSortDown /> : <IconSortUp />}
          </span>
          <span className="SortButtonText heading3">{t("sortBy")}</span>
          <Dropdown
            overlay={sortOverlay}
            trigger="click"
            disabled={isEmpty(items)}
            getPopupContainer={(triger) => triger.parentNode}
          >
            <span className="selected heading3">
              {sortToRender.label}
              <IconTrigDown />
            </span>
          </Dropdown>
        </div>
      </div>

      {isEmpty(items) ? (
        <NoResult strPath="garage" onClick={clickShopNow} />
      ) : (
        <>
          <div className="CarGrid">
            {pageItems?.map((car, index) => (
              <div key={index}>
                <div className="GarageCarName">{`#${car.assetId} ${car.name}`}</div>
                <CarCard
                  item={car}
                  salectable={car.assetType === "Car"}
                  selected={selectedCar?.assetId === car.assetId}
                  onShowDetail={() => showDetail(car.assetId, car.assetType)}
                  onSelect={() => handleSelectCar(car.assetId)}
                />
              </div>
            ))}
          </div>
          <Pagination
            hideOnSinglePage
            className="RioPagination"
            total={items.length}
            current={page}
            pageSize={12}
            defaultCurrent={1}
            showSizeChanger={false}
            onChange={setPage}
          />
        </>
      )}
    </div>
  )
}

export default CarsTab
