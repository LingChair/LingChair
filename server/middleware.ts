import { Request, Response, NextFunction } from "express";
import FileManager from "./data/FileManager.ts";
import TokenManager from "./api/TokenManager.ts";
import UserChatLinker from "./data/UserChatLinker.ts";
import fileUpload from "express-fileupload";

export class Middleware {
    static Authroize(req: Request, res: Response, chat_id: string | undefined) {
        const userToken = TokenManager.decode(req.headers.token || req.cookies.token);
        if (!TokenManager.checkToken(userToken, req.headers["device-id"] || req.cookies.device_id)) {
            res.status(401).send({
                msg: "401 UnAuthorized",
            });
            return false;
        }
        if (chat_id && !UserChatLinker.checkUserIsLinkedToChat(userToken.author, chat_id)) {
            res.status(403).send({
                msg: "403 Forbidden",
            });
            return false;
        }
        return true;
    }

    static Get_uploaded_files(req: Request, res: Response, next: NextFunction) {
        const hash = req.params.hash as string;
        if (hash == null) {
            res.status(404).send({
                msg: "404 Not Found",
            });
            return;
        }
        const file = FileManager.findByHash(hash);

        if (file == null) {
            res.status(404).send({
                msg: "404 Not Found",
            });
            return;
        }

        if (file.getChatId() != null) {
            if (!Middleware.Authroize(req, res, file.getChatId() as string)) {
                return;
            }
        }
        next();
    }

    static Post_upload_file(req: Request, res: Response, next: NextFunction) {
        if (!Middleware.Authroize(req, res, req.body.chat_id)) {
            return;
        }
        const file = req.files?.file as fileUpload.UploadedFile;
        if (file?.data == null) {
            res.status(400).send({
                msg: "No file was found or multiple files were uploaded",
            });
            return;
        }
        if (req.body.file_name == null) {
            res.status(400).send({
                msg: "Filename is required",
            });
            return;
        }
    }
}
