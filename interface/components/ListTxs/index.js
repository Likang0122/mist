import React, { Component } from 'react';
import { connect } from 'react-redux';
import {} from '../../actions.js';
import DappIdenticon from '../DappIdenticon';

class ListTxs extends Component {
  constructor(props) {
    super(props);

    this.state = { showDetails: [] };
  }

  componentDidMount() {
    this.updatePendingTxs();
  }

  updatePendingTxs() {
    // TODO:
    // If tx.blockNumber is null, on every new block check if it has a blockNumber.
    // Also set tx.failed with receipt status===0(fail)|1(success)
    // Also set tx.contractAddress if tx.isNewContract
  }

  networkString(networkId) {
    switch (networkId) {
      case 1:
        return 'Main';
      case 3:
        return 'Ropsten';
      case 4:
        return 'Rinkeby';
      case 42:
        return 'Kovan';
      default:
        return 'Unknown';
    }
  }

  handleDetailsClick = index => {
    if (this.state.showDetails.includes(index)) {
      const showDetails = this.state.showDetails;
      const theIndex = showDetails.indexOf(index);
      showDetails.splice(theIndex, 1);
      this.setState({ showDetails });
    } else {
      this.setState({ showDetails: [...this.state.showDetails, index] });
    }
  };

  renderMoreDetails(index) {
    const tx = this.props.txs[index];

    if (!this.state.showDetails.includes(index)) {
      return (
        <div
          className="tx-moreDetails"
          onClick={() => this.handleDetailsClick(index)}
        >
          More details
        </div>
      );
    }

    return (
      <div>
        <div>
          Gas:{' '}
          <span className="bold">{web3.utils.hexToNumberString(tx.gas)}</span>
        </div>
        <div>
          Gas Price:{' '}
          <span className="bold">
            {web3.utils.hexToNumberString(tx.gasPrice)}
          </span>
        </div>
        <div>
          Nonce:{' '}
          <span className="bold">{web3.utils.hexToNumberString(tx.nonce)}</span>
        </div>
        {tx.data && (
          <div>
            Data: <span className="bold">{tx.data}</span>
          </div>
        )}
        <div
          className="tx-moreDetails"
          onClick={() => this.handleDetailsClick(index)}
        >
          Less details
        </div>
      </div>
    );
  }

  render() {
    const txs = this.props.txs;

    const txList = txs.map((tx, index) => {
      let txHashLink = 'Unavailable';
      if (tx.hash) {
        let subdomain = '';
        if (tx.networkId === 3) {
          subdomain = 'ropsten.';
        } else if (tx.networkId === 4) {
          subdomain = 'rinkeby.';
        } else if (tx.networkId === 42) {
          subdomain = 'kovan.';
        }
        txHashLink = (
          <a
            href={`https://${subdomain}etherscan.io/tx/${tx.hash}`}
            target="_blank"
          >
            {tx.hash}
          </a>
        );
      }

      const etherAmount =
        web3.utils.toBN(tx.value).toNumber() / 1000000000000000000;

      let status = <span style={{ color: 'grey' }}>Pending</span>;
      if (tx.failed) {
        status = <span style={{ color: 'red' }}>Failed</span>;
      } else if (tx.blockNumber) {
        status = <span style={{ color: 'green' }}>Confirmed</span>;
      }

      return (
        <div key={tx.hash || tx.nonce} className="tx">
          <div>
            Network:{' '}
            <span className="bold">{this.networkString(tx.networkId)}</span>
          </div>
          <div>
            Status: <span className="bold">{status}</span>
          </div>
          <div>
            Transaction Hash: <span className="bold">{txHashLink}</span>
          </div>
          <div>
            From:
            <DappIdenticon identity={tx.from} size="small" />
            <span className="bold">{tx.from}</span>
          </div>
          {tx.to && (
            <div>
              To:
              <DappIdenticon identity={tx.to} size="small" />
              <span className="bold">{tx.to}</span>
            </div>
          )}
          <div>
            Ether Amount: <span className="bold">{etherAmount}</span>
          </div>
          <div>
            Created At: <span className="bold">{tx.createdAt}</span>
          </div>
          {this.renderMoreDetails(index)}
        </div>
      );
    });

    return (
      <div className="popup-windows list-txs">
        <div className="header">
          <h1>Transaction History</h1>
          {txs.length > 0 && <h2>{txs.length} total</h2>}
        </div>
        <div className="tx-list">
          {txList}
          {txs.length === 0 && (
            <div className="no-txs">No transactions yet.</div>
          )}
        </div>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(ListTxs);