import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { useStores } from '../contexts/storesContext';
import { useLocation } from 'react-router-dom';
import Address from '../components/common/Address';

const UserInfoWrapper = styled.div`
    width: 100%;
    background: white;
    padding: 20px 20px;
    border: 1px solid var(--medium-gray);
    margin-top: 24px;
    font-weight: 400;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    
    .loader {
      text-align: center;
      font-family: Roboto;
      font-style: normal;
      font-weight: 500;
      font-size: 15px;
      line-height: 18px;
      color: #BDBDBD;
      padding: 44px 0px;
      
      img {
        margin-bottom: 10px;
      }
    }
    
`;

const UserPage = () => {
    const {
        root: { daoStore, blockchainStore },
    } = useStores();
    const userAddress = useLocation().pathname.split("/")[2];
    const userEvents = daoStore.getUserEvents(userAddress);
    const userRep = daoStore.getUserRep(userAddress);
    const loading = false;

    return (
      <UserInfoWrapper>
        <h2>User <Address size="long" address={userAddress}/></h2>
        <h3>REP: {userRep.percentage.toFixed(2)} %</h3>
        {loading ?
          <center>
            <div className="loader">
            <img alt="bolt" src={require('assets/images/bolt.svg')} />
                <br/>
                Fetching user information...
            </div>
          </center>
        : <div>
          <h2> History </h2>
          {userEvents.history.map((historyEvent, i) => {
            return(
            <div key={"userHistoryEvent"+i}>
              <span> {historyEvent.text} </span> 
              {i < userEvents.history.length - 1 ? <hr/> : <div/>}
            </div>);
          })}
          </div>
        }
        
      </UserInfoWrapper>
    );
};

export default UserPage;
