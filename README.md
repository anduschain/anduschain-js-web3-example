# anduschain-js-web3-example

## Anduschain Node rpc sample using web3js.

## Install
```$xslt
$ git clone https://github.com/anduschain/anduschain-js-web3-example.git
$ npm install
```

## Test
project_root/config.js : configure file 

설정 항목 : rpcHost, keyPath, keyPass, account

rpcHost : docker-node 호스트 http://localhost:8545 ~ 8548
keyPath : keystore 파일, (기본 : 프로젝트 tmp 내 사용)
keyPass : keystore 비밀번호
account : 보낼 주소
chainId : mainnet, testnet, chainId(integer) 중 한 가지 명시
