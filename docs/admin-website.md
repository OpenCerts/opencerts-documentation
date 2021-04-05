---
id: admin-website
title: Admin Website
sidebar_label: Admin Website
---

[The Admin Website Portal](https://admin.opencerts.io/) allows users to deploy document store and issue/revoke certificates with their Metamask Wallet or their Ledger Device.

### Ledger Device

[As Metamask supports Ledger Hardware Wallets](https://medium.com/@brunobar79), it is now recommended for users to connect using the Metamask flow.

Metamask can act as a proxy to interact with the Ledger Device, simply use "Add Hardware Wallet" inside Metamask to add your Ledger.

You may follow the instructions [here](https://medium.com/metamask/metamask-now-supports-ledger-hardware-wallets-847f4d51546) or [here](https://www.youtube.com/watch?v=l4Cvb4IKLIk&ab_channel=DeversiFi) to connect your Ledger to Metamask:

1. make sure your Ledger is completely up to date
1. before opening admin site, connect Ledger to a computer and unlock it, then open the Ethereum app
1. ensure that **contract data** is set to yes in Ethereum app
1. before opening admin site, add Ledger to Metamask wallet and ensure that it shows up as connected

After adding the Ledger to Metamask, you can follow the instructions below to issue a certificate:

1. open admin site, select Metamask
1. perform the action (issue/revoke/deploy), and wait for Metamask to prompt for the transaction confirmation after hitting the action button
1. you /may/see a Windows security dialog after initiating a transaction, if you do - look at your Ledger to see if there is a confirmation dialog with **Review Transaction**. if you don't, try pressing any button on the Ledger once and wait
1. review the transaction on Ledger
1. approve the transaction on Ledger
1. wait for the transaction to complete
