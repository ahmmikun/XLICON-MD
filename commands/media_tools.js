const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const ffmpeg = require("fluent-ffmpeg");
const { cmd, tlang } = require("../lib");

function getTempFilePath(ext) {
    return path.join(os.tmpdir(), `xlicon_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`);
}

function safeUnlink(file) {
    try {
        if (file && fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    } catch (e) {
        // ignore cleanup error
    }
}

//---------------------------------------------------------------------------
cmd({
    pattern: "slowmo",
    category: "misc",
    desc: "Adds slow motion to video.",
    filename: __filename,
},
async (Void, citel) => {
    if (!citel.quoted) return citel.reply("*Please quote a video.*");
    if (!/video/.test(citel.quoted.mtype)) return citel.reply("*Need a video message.*");

    await citel.reply("Applying slow-motion effect, please wait...");
    let media = null;
    let outputPath = getTempFilePath("mp4");

    try {
        media = await Void.downloadAndSaveMediaMessage(citel.quoted);
        ffmpeg(media)
            .videoFilters("minterpolate=fps=120")
            .videoFilters("setpts=4*PTS")
            .noAudio()
            .format("mp4")
            .save(outputPath)
            .on("end", async () => {
                try {
                    await Void.sendMessage(citel.chat, { video: fs.readFileSync(outputPath) }, { quoted: citel });
                } catch (err) {
                    citel.reply("Error sending converted video: " + err.message);
                } finally {
                    safeUnlink(outputPath);
                    safeUnlink(media);
                }
            })
            .on("error", (err) => {
                safeUnlink(outputPath);
                safeUnlink(media);
                citel.reply("Error processing slowmo: " + err.message);
            });
    } catch (e) {
        safeUnlink(outputPath);
        safeUnlink(media);
        return citel.reply("Failed to process video: " + e.message);
    }
});

//---------------------------------------------------------------------------
cmd({
    pattern: "spectrum",
    category: "misc",
    desc: "Converts sound/video into an audio spectrum visualizer video.",
    filename: __filename,
},
async (Void, citel) => {
    if (!citel.quoted) return citel.reply("*Please quote an audio or video message.*");
    if (!/video|audio/.test(citel.quoted.mtype)) return citel.reply("*Need an audio or video message.*");

    await citel.reply("Generating spectrum visualizer, please wait...");
    let media = null;
    let outputPath = getTempFilePath("mp4");

    try {
        media = await Void.downloadAndSaveMediaMessage(citel.quoted);
        ffmpeg(media)
            .outputOptions([
                "-y",
                "-filter_complex",
                "[0:a]showspectrum=s=720x1280,format=yuv420p[v]",
                "-map",
                "[v]",
                "-map 0:a",
            ])
            .format("mp4")
            .save(outputPath)
            .on("end", async () => {
                try {
                    await Void.sendMessage(citel.chat, { video: fs.readFileSync(outputPath) }, { quoted: citel });
                } catch (err) {
                    citel.reply("Error sending spectrum video: " + err.message);
                } finally {
                    safeUnlink(outputPath);
                    safeUnlink(media);
                }
            })
            .on("error", (err) => {
                safeUnlink(outputPath);
                safeUnlink(media);
                citel.reply("Error generating spectrum: " + err.message);
            });
    } catch (e) {
        safeUnlink(outputPath);
        safeUnlink(media);
        return citel.reply("Failed to process spectrum: " + e.message);
    }
});

//---------------------------------------------------------------------------
cmd({
    pattern: "mp3crusher",
    category: "misc",
    desc: "Distorts and bitcrushes audio for a comical sound effect.",
    filename: __filename,
},
async (Void, citel) => {
    if (!citel.quoted) return citel.reply("*Please quote an audio or video message.*");
    if (!/video|audio/.test(citel.quoted.mtype)) return citel.reply("*Need an audio or video message.*");

    await citel.reply("Distorting audio, please wait...");
    let media = null;
    let outputPath = getTempFilePath("mp3");

    try {
        media = await Void.downloadAndSaveMediaMessage(citel.quoted);
        ffmpeg(media)
            .outputOptions([
                "-y",
                "-filter_complex",
                "acrusher=level_in=8:level_out=18:bits=8:mode=log:aa=1",
            ])
            .format("mp3")
            .save(outputPath)
            .on("end", async () => {
                try {
                    await Void.sendMessage(citel.chat, { audio: fs.readFileSync(outputPath), mimetype: "audio/mpeg" }, { quoted: citel });
                } catch (err) {
                    citel.reply("Error sending crushed audio: " + err.message);
                } finally {
                    safeUnlink(outputPath);
                    safeUnlink(media);
                }
            })
            .on("error", (err) => {
                safeUnlink(outputPath);
                safeUnlink(media);
                citel.reply("Error processing audio: " + err.message);
            });
    } catch (e) {
        safeUnlink(outputPath);
        safeUnlink(media);
        return citel.reply("Failed to process audio: " + e.message);
    }
});

//---------------------------------------------------------------------------
cmd({
    pattern: "mp4image",
    category: "misc",
    desc: "Converts a photo to a 5-second video.",
    filename: __filename,
},
async (Void, citel) => {
    if (!citel.quoted) return citel.reply("*Please quote an image.*");
    if (!/image/.test(citel.quoted.mtype)) return citel.reply("*Need an image message.*");

    await citel.reply("Converting photo to video, please wait...");
    let media = null;
    let outputPath = getTempFilePath("mp4");

    try {
        media = await Void.downloadAndSaveMediaMessage(citel.quoted);
        ffmpeg(media)
            .loop(5)
            .fps(19)
            .videoBitrate(400)
            .format("mp4")
            .save(outputPath)
            .on("end", async () => {
                try {
                    await Void.sendMessage(citel.chat, { video: fs.readFileSync(outputPath) }, { quoted: citel });
                } catch (err) {
                    citel.reply("Error sending video: " + err.message);
                } finally {
                    safeUnlink(outputPath);
                    safeUnlink(media);
                }
            })
            .on("error", (err) => {
                safeUnlink(outputPath);
                safeUnlink(media);
                citel.reply("Error converting image to video: " + err.message);
            });
    } catch (e) {
        safeUnlink(outputPath);
        safeUnlink(media);
        return citel.reply("Failed to convert image: " + e.message);
    }
});

//---------------------------------------------------------------------------
cmd({
    pattern: "mp4reverse",
    alias: ["reversevideo", "videoreverse"],
    category: "misc",
    desc: "Plays the video and audio in reverse.",
    filename: __filename,
},
async (Void, citel) => {
    if (!citel.quoted) return citel.reply("*Please quote a video.*");
    if (!/video/.test(citel.quoted.mtype)) return citel.reply("*Need a video message.*");

    await citel.reply("Reversing video, please wait...");
    let media = null;
    let outputPath = getTempFilePath("mp4");

    try {
        media = await Void.downloadAndSaveMediaMessage(citel.quoted);
        ffmpeg(media)
            .outputOptions(["-y", "-vf", "reverse", "-af", "areverse"])
            .format("mp4")
            .fps(22)
            .save(outputPath)
            .on("end", async () => {
                try {
                    await Void.sendMessage(citel.chat, { video: fs.readFileSync(outputPath) }, { quoted: citel });
                } catch (err) {
                    citel.reply("Error sending reversed video: " + err.message);
                } finally {
                    safeUnlink(outputPath);
                    safeUnlink(media);
                }
            })
            .on("error", (err) => {
                safeUnlink(outputPath);
                safeUnlink(media);
                citel.reply("Error reversing video: " + err.message);
            });
    } catch (e) {
        safeUnlink(outputPath);
        safeUnlink(media);
        return citel.reply("Failed to reverse video: " + e.message);
    }
});

//---------------------------------------------------------------------------
cmd({
    pattern: "x2mp4",
    category: "misc",
    desc: "Reduces video size/dimensions by 50%.",
    filename: __filename,
},
async (Void, citel) => {
    if (!citel.quoted) return citel.reply("*Please quote a video.*");
    if (!/video/.test(citel.quoted.mtype)) return citel.reply("*Need a video message.*");

    await citel.reply("Compressing video by 50%, please wait...");
    let media = null;
    let outputPath = getTempFilePath("mp4");

    try {
        media = await Void.downloadAndSaveMediaMessage(citel.quoted);
        ffmpeg(media)
            .withSize("50%")
            .format("mp4")
            .save(outputPath)
            .on("end", async () => {
                try {
                    await Void.sendMessage(citel.chat, { video: fs.readFileSync(outputPath) }, { quoted: citel });
                } catch (err) {
                    citel.reply("Error sending compressed video: " + err.message);
                } finally {
                    safeUnlink(outputPath);
                    safeUnlink(media);
                }
            })
            .on("error", (err) => {
                safeUnlink(outputPath);
                safeUnlink(media);
                citel.reply("Error resizing video: " + err.message);
            });
    } catch (e) {
        safeUnlink(outputPath);
        safeUnlink(media);
        return citel.reply("Failed to resize video: " + e.message);
    }
});

//---------------------------------------------------------------------------
cmd({
    pattern: "x4mp4",
    category: "misc",
    desc: "Reduces video size/dimensions by 75%.",
    filename: __filename,
},
async (Void, citel) => {
    if (!citel.quoted) return citel.reply("*Please quote a video.*");
    if (!/video/.test(citel.quoted.mtype)) return citel.reply("*Need a video message.*");

    await citel.reply("Compressing video by 75%, please wait...");
    let media = null;
    let outputPath = getTempFilePath("mp4");

    try {
        media = await Void.downloadAndSaveMediaMessage(citel.quoted);
        ffmpeg(media)
            .withSize("25%")
            .format("mp4")
            .save(outputPath)
            .on("end", async () => {
                try {
                    await Void.sendMessage(citel.chat, { video: fs.readFileSync(outputPath) }, { quoted: citel });
                } catch (err) {
                    citel.reply("Error sending compressed video: " + err.message);
                } finally {
                    safeUnlink(outputPath);
                    safeUnlink(media);
                }
            })
            .on("error", (err) => {
                safeUnlink(outputPath);
                safeUnlink(media);
                citel.reply("Error resizing video: " + err.message);
            });
    } catch (e) {
        safeUnlink(outputPath);
        safeUnlink(media);
        return citel.reply("Failed to resize video: " + e.message);
    }
});
