import { arrayBufferToBase64 } from "hono/dist/utils/encode";
import { timingSafeEqual } from "hono/dist/utils/buffer";
import utils from "../utils";

// Username
const unID = new Uint8Array(1);
crypto.getRandomValues(unID);

const AdminUsername = "admin-" + utils.bufferToHex(unID);

// Password
const salt = new Uint8Array(16);
crypto.getRandomValues(salt);

const rawPassword = crypto.randomUUID();
const saltedPassword = rawPassword + utils.bufferToHex(salt);

const AdminSalt = await arrayBufferToBase64(salt);
const AdminKey = await arrayBufferToBase64(Bun.SHA512.hash(saltedPassword));
async function isAdmin(username: string, password: string): Promise<boolean> {
    if(username === AdminUsername) {
        const hashed = await arrayBufferToBase64(Bun.SHA512.hash(password + AdminSalt));
        return await timingSafeEqual(hashed, AdminKey);
    }
    return false;
}

// Export
export default isAdmin;
