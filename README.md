# node-go2ubl

Node library to use the Go2UBL API. Allows you to:

* Add companies to your account
* Enable companies in your account
* Disable companies in your account
* Get a company's whitelist with accepted email addresses
* Add an email address to a company's whitelist
* Remove an email address from a company's whitelist
* Send a document to Go2UBL to convert to an UBL 2 xml
* Track a document's status
* Get the errors or UBL for a sent document

## Please note

This is not in any way associated with Go2UBL. Use at your own risk. Please see the license at the bottom of this README.

## How to install

```
npm install node-go2ubl --save
```


## Before you can call the Go2UBL API

You will need to aquire your API credentials from Go2UBl. After this you can initialize the library as follows:

```
const go2ubl = require('node-go2ubl');

const credentials = {
    identifier: 'Get these from Go2UBL...',
    code: 'Get these from Go2UBL...',
    token: 'Get these from Go2UBL...',
};

go2ubl.initialize(credentials);
```

## Sending and tracking a document for conversion to UBL

```
// ... initialize your library, see above ...
await go2ubl.uploadDocument({
    documentId,
    chamberOfCommerceId: KVK,
    document: fs.readFileSync('document.pdf')
});

const update = async () => {
    const documentResponse = await go2ubl.getDocumentsWithChangedStatus();
    if (documentResponse.Success) {
        for (let document of documentResponse.Results) {
            const response = await go2ubl.getDocument(document.DocumentGuid);
            console.log(response.Result);
        }
    }

    const documentsStillToBeProcessed = await go2ubl.getDocumentsStillToBeProcessed();
    console.log(`${documentsStillToBeProcessed.Results.length} are waiting to be processed.`);
    const documentsStillToBeDelivered = await go2ubl.getDocumentsStillToBeDelivered();
    console.log(`${documentsStillToBeDelivered.Results.length} are being delivered.`);
    const processedDocuments = await go2ubl.getReadyDocuments();
    console.log(`${documentsStillToBeDelivered.Results.length} are ready.`);
    const declinedDocuments = await go2ubl.getFailedDocuments();
    console.log(`${documentsStillToBeDelivered.Results.length} have failed.`);
    setTimeout(update, 5000);
}

setTimeout(update, 5000);
```

## Adding and modifying companies

```
const chamberOfCommerce = '12345678';
console.log(await go2ubl.addCompany(chamberOfCommerce, [], 'info@example.nl'));
console.log(await go2ubl.disableCompany(chamberOfCommerce));
console.log(await go2ubl.enableCompany(chamberOfCommerce));
console.log(await go2ubl.addEmailToCompanyWhitelist(chamberOfCommerce, 'postmaster@example.nl'));
console.log(await go2ubl.getCompany(chamberOfCommerce));
console.log(await go2ubl.deleteEmailFromCompanyWhitelist(chamberOfCommerce, 'postmaster@example.nl'));
```

## LICENSE

MIT License

Copyright (c) 2017 Jaapjan Tinbergen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
