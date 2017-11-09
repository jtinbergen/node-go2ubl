const request = require('superagent');

let COMPANY_API = null;
let DOCUMENT_API = null;
const credentials = {};

/**
 * @private
 */
const postToGo2Ubl = async ({ url, data }) => new Promise((resolve, reject) => {
  request
        .post(url)
        .send(data)
        .set('identifier', credentials.identifier)
        .set('code', credentials.code)
        .set('token', credentials.token)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err || !res.ok) {
            reject();
          } else {
            resolve(res.body);
          }
        });
});

/**
 * @private
 */
const standardPost = async (url, data) => postToGo2Ubl({
  url,
  data,
});

/**
 * initialize node-go2ubl with your credentials.
 *
 * @param {*} credentials
 */
const initialize = ({
    companyApi = 'https://secure.go2ubl.nl/api/request',
    documentApi = 'https://secure.go2ubl.nl/api/v1',
    code,
    identifier,
    token,
}) => {
  COMPANY_API = companyApi;
  DOCUMENT_API = documentApi;
  credentials.code = code;
  credentials.identifier = identifier;
  credentials.token = token;
};

/**
 * Get details about a company using its chamber of commerce identity.
 */
const getCompany = async (chamberOfCommerceId) => {
  if (!chamberOfCommerceId) {
    return { Success: false, message: 'chamber of commerce identity is required.' };
  }

  return postToGo2Ubl({
    url: `${COMPANY_API}/GetCompanyByKvk`,
    data: {
      KvKNumber: chamberOfCommerceId,
    },
  });
};

/**
 * Enable an existing company using its chamber of commerce identity.
 */
const enableCompany = async chamberOfCommerceId => postToGo2Ubl({
  url: `${COMPANY_API}/EnableCompanyByKvk`,
  data: {
    KvKNumber: chamberOfCommerceId,
  },
});

/**
 * Add a new company using its chamber of commerce identity, its initial whitelist and the default reply email address.
 */
const addCompany = async (chamberOfCommerceId, initialEmailWhitelist, replyEmailAddress) => {
  if (!chamberOfCommerceId || !replyEmailAddress) {
    return false;
  }

  const data = {
    KvKNumber: chamberOfCommerceId,
    ValidSenders: initialEmailWhitelist,
    ReplyAddress: replyEmailAddress,
  };

  return postToGo2Ubl({
    url: `${COMPANY_API}/AddCompanyByKvk`,
    data,
  });
};

/**
 * Disable a new company using its chamber of commerce identity.
 */
const disableCompany = async chamberOfCommerceId => postToGo2Ubl({
  url: `${COMPANY_API}/DisableCompanyByKvk`,
  data: {
    KvKNumber: chamberOfCommerceId,
  },
});

/**
 * Delete an email address from a company using its chamber of commerce identity and the email address to delete.
 */
const deleteEmailFromCompanyWhitelist = async (chamberOfCommerceId, emailAddressToDelete) => postToGo2Ubl({
  url: `${COMPANY_API}/DeleteWhiteListByKvk`,
  data: {
    KvKNumber: chamberOfCommerceId,
    Email: emailAddressToDelete,
  },
});

/**
 * Add an email address to a company's whitelist using its chamber of commerce identity and the email address to add.
 */
const addEmailToCompanyWhitelist = async (chamberOfCommerceId, emailAddressToAdd) => postToGo2Ubl({
  url: `${COMPANY_API}/AddWhiteListByKvk`,
  data: {
    KvKNumber: chamberOfCommerceId,
    Email: emailAddressToAdd,
  },
});

/**
 * Gets the currently whitelisted email addresses for a company using its chamber of commerce identity.
 */
const getCompanyWhitelist = async chamberOfCommerceId => postToGo2Ubl({
  url: `${COMPANY_API}/GetWhiteListByKvk`,
  data: {
    KvKNumber: chamberOfCommerceId,
  },
});

/**
 * Upload a document to Go2UBL for conversion to an UBL.
 */
const uploadDocument = async ({ externalId, filename, chamberOfCommerceId, document }) => postToGo2Ubl({
  url: `${DOCUMENT_API}/PurchaseStandard/PutDocument`,
  data: {
    KvkNumber: chamberOfCommerceId,
    ExternalId: externalId,
    FileName: filename || externalId,
    Content: document,
  },
});

/**
 * Get the details about a document using its document identity.
 */
const getDocument = async documentId => postToGo2Ubl({
  url: `${DOCUMENT_API}/GetDocument`,
  data: {
    DocumentGuid: documentId,
  },
});

/**
 * Gets all the documents of which its status has changed.
 */
const getDocumentsWithChangedStatus = async () => standardPost(`${DOCUMENT_API}/GetDocumentsWithUpdatedStatus`, {});

/**
 * Get a list of all the documents still to be processed.
 */
const getDocumentsStillToBeProcessed = async () => standardPost(`${DOCUMENT_API}/GetDocumentsToBeProcessed`, {});

/**
 * Get a list of all the documents that still need to be delivered.
 */
const getDocumentsStillToBeDelivered = async () => standardPost(`${DOCUMENT_API}/GetDocumentsToBeDelivered`, {});

/**
 * Get a list of all the documents which are ready.
 */
const getReadyDocuments = async () => standardPost(`${DOCUMENT_API}/GetArchivedDocumentsProcessed`, {});

/**
 * Get a list of all the documents which have failed.
 */
const getFailedDocuments = async () => standardPost(`${DOCUMENT_API}/GetArchivedDocumentsDeclined`, {});

module.exports = {
  initialize,
  getCompany,
  enableCompany,
  addCompany,
  disableCompany,
  deleteEmailFromCompanyWhitelist,
  addEmailToCompanyWhitelist,
  getCompanyWhitelist,
  uploadDocument,
  getDocument,
  getDocumentsWithChangedStatus,
  getDocumentsStillToBeProcessed,
  getDocumentsStillToBeDelivered,
  getReadyDocuments,
  getFailedDocuments,
};
