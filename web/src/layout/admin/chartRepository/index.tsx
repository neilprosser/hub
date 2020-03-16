import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { MdAddCircle, MdAdd } from 'react-icons/md';
import { IoMdRefreshCircle, IoMdRefresh } from 'react-icons/io';
import { ChartRepository as ChartRepo, UserAuth } from '../../../types';
import { API } from '../../../api';
import isNull from 'lodash/isNull';
import Loading from '../../common/Loading';
import NoData from '../../common/NoData';
import ChartRepositoryModal from './Modal';
import ChartRepositoryCard from './Card';
import styles from './ChartRepository.module.css';

interface ModalStatus {
  open: boolean;
  chartRepository?: ChartRepo;
}

interface Props {
  isAuth: null | UserAuth;
  setIsAuth: React.Dispatch<React.SetStateAction<UserAuth | null>>;
}

const ChartRepository = (props: Props) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [modalStatus, setModalStatus] = useState<ModalStatus>({
    open: false,
  });
  const [chartRepositories, setChartRepositories] = useState<ChartRepo[] | null>(null);

  async function fetchCharts() {
    try {
      setIsLoading(true);
      setChartRepositories(await API.getChartRepositories());
      setIsLoading(false);
    } catch(err) {
      setIsLoading(false);
      if (err.statusText !== 'ErrLoginRedirect') {
        setChartRepositories([]);
      } else {
       onAuthError();
      }
    }
  };

  useEffect(() => {
    fetchCharts();
  }, []); /* eslint-disable-line react-hooks/exhaustive-deps */

  const onAuthError = (): void => {
    props.setIsAuth({status: false});
    history.push(`/login?redirect=/admin`);
  }

  return (
    <>
      <div>
        <div className="d-flex flex-row align-items-center justify-content-between">
          <div className="h3 pb-0">Chart repositories</div>

          <div>
            <button
              className={`btn btn-primary btn-sm text-uppercase mr-2 ${styles.btnAction}`}
              onClick={fetchCharts}
            >
              <div className="d-flex flex-row align-items-center justify-content-center">
                <IoMdRefresh className="d-inline d-sm-none" />
                <IoMdRefreshCircle className="d-none d-sm-inline mr-2" />
                <span className="d-none d-sm-inline">Refresh</span>
              </div>
            </button>

            <button
              className={`btn btn-secondary btn-sm text-uppercase mr-2 ${styles.btnAction}`}
              onClick={() => setModalStatus({open: true})}
            >
              <div className="d-flex flex-row align-items-center justify-content-center">
                <MdAdd className="d-inline d-sm-none" />
                <MdAddCircle className="d-none d-sm-inline mr-2" />
                <span className="d-none d-sm-inline">Add</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {modalStatus.open && (
        <ChartRepositoryModal
          open={modalStatus.open}
          chartRepository={modalStatus.chartRepository}
          onSuccess={fetchCharts}
          onAuthError={onAuthError}
          onClose={() => setModalStatus({open: false})}
        />
      )}

      {(isLoading || isNull(chartRepositories)) && <Loading />}

      {!isNull(chartRepositories) && (
        <>
          {chartRepositories.length === 0 ? (
            <NoData>
              <>
                <p className="h6 my-4">
                  Add your first chart repository!
                </p>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalStatus({open: true})}
                >
                  <div className="d-flex flex-row align-items-center">
                    <MdAddCircle className="mr-2" />
                    <span>Add chart repository</span>
                  </div>
                </button>
              </>
            </NoData>
          ) : (
            <div className="list-group my-4">
              {chartRepositories.map((repo: ChartRepo) => (
                <ChartRepositoryCard
                  key={repo.name}
                  chartRepository={repo}
                  setModalStatus={setModalStatus}
                  onSuccess={fetchCharts}
                  onAuthError={onAuthError}
                />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default ChartRepository;
