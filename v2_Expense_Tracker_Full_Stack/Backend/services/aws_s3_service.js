const AWS=require('aws-sdk');

exports.uploadToS3=(fileName,data)=>{

    try{

    let  s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
   
    var params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        Body: data,
        ACL: 'public-read'
    };

    return new Promise((resolve,reject)=>{
        s3.upload(params,(err, data)=>{
            if (err) {
                console.error("Error uploading to S3:",err);
                reject(err);
            }
            resolve(data.Location);
        });
    }).catch(err=>{
        console.error("Error uploading to S3:",err);
        throw err;
    });
}catch(err){    
    console.error("Error uploading to S3:",err);
    throw err;
}
}