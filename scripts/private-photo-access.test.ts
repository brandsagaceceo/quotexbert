import assert from "node:assert/strict";
import {
  getPrivateBlobStoreId,
  isPrivatePhotoOwnedBy,
  privatePhotoPath,
  privatePhotoUrl,
  uploadPrivateImage,
} from "../lib/upload";
import {
  approvedProjectPhotos,
  parseApprovedPhotoSelection,
  privatePhotoAccessAllowed,
  privatePhotosBelongTo,
} from "../lib/private-photo-records";

const ownPath = "homeowner-photos/user_123/abc_DEF-456.jpg";
const ownUrl = privatePhotoUrl(ownPath);
const otherUrl = privatePhotoUrl(
  "homeowner-photos/user_456/abc_DEF-456.jpg",
);
const legacyPublicUrl =
  "https://existing.public.blob.vercel-storage.com/leads/legacy.jpg";

assert.equal(privatePhotoPath(ownUrl), ownPath);
assert.equal(isPrivatePhotoOwnedBy(ownUrl, "user_123"), true);
assert.equal(isPrivatePhotoOwnedBy(otherUrl, "user_123"), false);
assert.equal(
  privatePhotoPath(
    "/api/private-photo?pathname=homeowner-photos%2Fuser_123%2F..%2Fsecret.jpg",
  ),
  null,
);
assert.equal(privatePhotosBelongTo([ownUrl], "user_123"), true);
assert.equal(privatePhotosBelongTo([otherUrl], "user_123"), false);
assert.equal(privatePhotosBelongTo([legacyPublicUrl], "user_123"), true);
assert.deepEqual(parseApprovedPhotoSelection({}), []);
assert.deepEqual(parseApprovedPhotoSelection({ photos: [ownUrl] }), [ownUrl]);
assert.equal(parseApprovedPhotoSelection({ photos: [ownUrl, 1] }), null);
assert.equal(
  parseApprovedPhotoSelection({ photos: Array.from({ length: 11 }, () => ownUrl) }),
  null,
);
assert.deepEqual(
  approvedProjectPhotos(JSON.stringify([legacyPublicUrl]), [legacyPublicUrl]),
  [legacyPublicUrl],
);
assert.deepEqual(
  approvedProjectPhotos(JSON.stringify([ownUrl, otherUrl]), [ownUrl]),
  [ownUrl],
);
assert.deepEqual(approvedProjectPhotos(JSON.stringify([ownUrl]), []), []);
assert.equal(
  approvedProjectPhotos(JSON.stringify([ownUrl]), [otherUrl]),
  null,
);
assert.equal(privatePhotoAccessAllowed(true, false, false), true);
assert.equal(privatePhotoAccessAllowed(false, true, true), true);
assert.equal(privatePhotoAccessAllowed(false, false, true), false);
assert.equal(privatePhotoAccessAllowed(false, true, false), false);

function verifyPrivateBlobOidcStoreSelection() {
  const keys = [
    "VERCEL_OIDC_TOKEN",
    "VERCEL_ENV",
    "BLOB_STORE_ID",
    "PRIVATE_BLOB_STORE_ID",
    "BLOB_READ_WRITE_TOKEN",
  ];
  const originalEnvironment = new Map(
    keys.map((key) => [key, process.env[key]]),
  );

  try {
    process.env.VERCEL_OIDC_TOKEN = "test-oidc-token";
    process.env.VERCEL_ENV = "production";
    process.env.BLOB_STORE_ID = "store_production_private";
    process.env.PRIVATE_BLOB_STORE_ID = "store_preview_private";
    assert.equal(getPrivateBlobStoreId(), "store_production_private");

    process.env.VERCEL_ENV = "preview";
    assert.equal(getPrivateBlobStoreId(), "store_preview_private");

    delete process.env.VERCEL_OIDC_TOKEN;
    process.env.BLOB_READ_WRITE_TOKEN = "test-public-token";
    assert.throws(
      () => getPrivateBlobStoreId(),
      /PRIVATE_IMAGE_STORAGE_NOT_CONFIGURED/,
    );
  } finally {
    for (const [key, value] of originalEnvironment) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}

async function verifyMissingPrivateCredentialsFailClosed() {
  const keys = [
    "VERCEL_OIDC_TOKEN",
    "BLOB_STORE_ID",
    "PRIVATE_BLOB_STORE_ID",
    "BLOB_READ_WRITE_TOKEN",
  ];
  const originalEnvironment = new Map(
    keys.map((key) => [key, process.env[key]]),
  );

  try {
    for (const key of keys) delete process.env[key];
    process.env.BLOB_READ_WRITE_TOKEN = "test-public-token";
    await assert.rejects(
      uploadPrivateImage(Buffer.from("photo"), "user_123", "image/jpeg"),
      /PRIVATE_IMAGE_STORAGE_NOT_CONFIGURED/,
    );
  } finally {
    for (const [key, value] of originalEnvironment) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}

verifyPrivateBlobOidcStoreSelection();
verifyMissingPrivateCredentialsFailClosed()
  .then(() => console.log("Private photo ownership checks passed"))
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
