import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Collapse, Typography, Row, Descriptions, Tabs, Avatar, Spin } from 'antd';
const { Panel } = Collapse;
import { toast } from 'react-toastify';
import httpService from '../../services/http.service';
import FundSnippet from './FundSnippet';


const Signals = ({
  signals = [],
  funds = {},
}) => {
  const { access_token } = useSelector((state) => state.user);
  const [state, setState] = useState({ loading: true, funds: {} });

  let fund_uuids = new Set();

  signals.forEach((year_data) => {
    year_data.months.forEach((month_data) => {
      month_data.signals.forEach((signal) => {
        fund_uuids.add(signal.fund_uuid);
      })
    })
  });

  useEffect(() => {
    const fetchFunds = async () => {
      let uuid_to_fund = {};

      try {
        Array.from(fund_uuids).forEach(async (fund_uuid) => {
          let response = await httpService.get(`/v1/funds/${fund_uuid}`, {headers: {
            Authorization: `Bearer ${access_token}`,
          }});
          let fundData = response.data;
          console.log(fundData);
          uuid_to_fund[fund_uuid] = fundData;
        });

        setState((prevState) => ({
          ...prevState,
          funds: uuid_to_fund,
          loading: false,
        }));

      } catch (error) {
        console.log(error);
        toast.error('Failed to fetch funds\' details.');
        setState((prevState) => ({ ...prevState, loading: false }));
      }
    };

    fetchFunds();
  }, [access_token]);

  if (state.loading) {
    return <Spin style={{ textAlign: 'center', paddingTop: '50px' }} size='large' />;
  }

  console.log(funds);
  console.log(funds);

  return (
    <div
      style={{
        padding: '10px',
      }}
    >
        {
            signals?.map((year_data) => (
                <>
                      <p>{year_data.year}, total: {year_data.total}</p>
                      {
                          year_data.months?.map((months_data, i) => (
                            <div>
                              {(new Date(new Date().setMonth(months_data.month - 1))).toLocaleString('en-US', {month: 'long'})}, total: {months_data.total}
                              <ul>
                              {
                                months_data.signals?.map((signal, i) => (
                                  <li>
                                    {signal.fund_uuid}, frequency {signal.count}
                                    <FundSnippet fund={funds[signal.fund_uuid]} />
                                  </li>
                                  ))
                                }
                              </ul>
                              {/* {(new Date(signal_date.year, signal_date.month - 1, 1)).toLocaleString('en-GB', {month: 'long', year: 'numeric'})}, */}
                              {/* count: {signal.source_count} */}
                            </div>
                          ))
                      }
                    <Collapse bordered={false} ghost>
                      <Panel header='Raw signal' key={year_data._id}>
                        <pre>{JSON.stringify(year_data)}</pre>
                      </Panel>
                    </Collapse>
                </>
            ))
        }
    </div>
  );
};

export default Signals;
