const Storage = require('@google-cloud/storage')
const Multer = require('multer')
const CLOUDBUCKET = process.env.CLOUD_BUCKET;

console.log("masuk img")
const storage = new Storage({
   projectId: process.env.GCLOUD_PROJECT,
   keyFilename: process.env.KEYFILE_PATH
})

const bucketName = storage.bucket(CLOUDBUCKET)

const getPublicUrl = (filename) => {
   return `https://storage.googleapis.com/${CLOUDBUCKET}/images/${filename}`
}

const sendUploadToGCS = (req, res, next) => {
   // console.log(req.headers.itemid);
   console.log("masuk upload");
   if (!req.file && !req.headers.userid) {
      return next('No file uploaded!')
   }
   else{
      console.log("error sini?")
      if(req.headers.userid && req.file){
         const gcsname = Date.now() + req.file.originalname
         const file = bucketName.file('/images/' + gcsname)
         
         const stream = file.createWriteStream({
            metadata: {
               contentType: req.file.mimetype
            }
         })
         
         
         stream.on('error', (err) => {
            console.log(JSON.stringify(err))
            req.file.cloudStorageError = err
            
            next(err)
         })
      
         stream.on('finish', () => {
            console.log('masuk nich');
            req.file.cloudStorageObject =  gcsname
            file.makePublic().then(() => {
               req.file.cloudStoragePublicUrl = getPublicUrl(gcsname)
               console.log("di make public")
               next()
            })
         })
      
         stream.end(req.file.buffer)
      }
      else{
         next();
      }
   }
}

const multer = Multer({
   storage: Multer.memoryStorage(),
   fileFilter: (req, file, cb) => {  
      console.log("masuk multer")
      const type = file.mimetype.split('/').shift()
      if (type != 'image') cb({ status: 400, error: 'filetype not acceptable' }, false)
      else cb(null, true)
   },
   limits: {
      fileSize: 5 * 1024 * 1024
   }
})


module.exports = {
   getPublicUrl,
   sendUploadToGCS,
   multer
}