# node-go2UBL

#### Node library to use the go2UBL API. Allows you to:

- Send purchase and sale invoices and logistic documents to go2UBL for conversion to UBL format
- Track a sent document's status during its conversion lifecycle
- Retrieve all document metadata created during the conversion lifecycle

#### As well as:

- Add companies to your account
- Enable companies in your account
- Disable companies in your account
- Get a company's whitelist with accepted email addresses
- Add an email address to a company's whitelist
- Remove an email address from a company's whitelist

## Please note

This library is not in any way associated with go2UBL. Use at your own risk. Please see the license at the bottom of this README.

## How to install

```
npm install node-go2ubl --save
```

## Before you can call the go2UBL API

You will need to aquire your API credentials from go2UBL. You can do so by contacting them using the following URL:

[https://www.go2ubl.nl/api](https://www.go2ubl.nl/api)

After this you can initialize the library as follows:

```
const go2UBL = require('node-go2ubl');

go2UBL.initialize({
    identifier: 'Get these from go2UBL...',
    code: 'Get these from go2UBL...',
    token: 'Get these from go2UBL...',
});
```

## Sending and then tracking a document during its conversion lifecycle

```
// ... after initializing your library (see above) ...

await go2UBL.uploadDocument({
    type: 'purchase', // purchase, sale or logistic
    includeLines: true, // This is only valid for purchase documents
    externalId, // Your own tracking identity
    filename: 'document.pdf',
    chamberOfCommerceId: KVK,
    document: fs.readFileSync('document.pdf').toJSON().data
});

const update = async () => {
    const documentResponse = await go2UBL.getDocumentsWithChangedStatus();
    if (documentResponse.Success) {
        for (let document of documentResponse.Results) {
            const response = await go2UBL.getDocument(document.DocumentGuid);
            console.log(response.Result);
        }
    }

    const documentsStillToBeProcessed = await go2UBL.getDocumentsStillToBeProcessed();
    console.log(`${documentsStillToBeProcessed.Results.length} are waiting to be processed.`);
    const documentsStillToBeDelivered = await go2UBL.getDocumentsStillToBeDelivered();
    console.log(`${documentsStillToBeDelivered.Results.length} are being delivered.`);
    const processedDocuments = await go2UBL.getReadyDocuments();
    console.log(`${processedDocuments.Results.length} are ready.`);
    const declinedDocuments = await go2UBL.getFailedDocuments();
    console.log(`${declinedDocuments.Results.length} have failed.`);

    setTimeout(update, 5000);
}

setTimeout(update, 5000);
```

## Adding and modifying companies

```
const chamberOfCommerce = '12345678';
console.log(await go2UBL.addCompany(chamberOfCommerce, [], 'info@example.nl'));
console.log(await go2UBL.disableCompany(chamberOfCommerce));
console.log(await go2UBL.enableCompany(chamberOfCommerce));
console.log(await go2UBL.addEmailToCompanyWhitelist(chamberOfCommerce, 'postmaster@example.nl'));
console.log(await go2UBL.getCompany(chamberOfCommerce));
console.log(await go2UBL.deleteEmailFromCompanyWhitelist(chamberOfCommerce, 'postmaster@example.nl'));
```

## LICENSE

MIT License

Copyright (c) 2023 Jaapjan Tinbergen

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
