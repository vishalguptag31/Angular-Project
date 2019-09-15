

const publicUrl = 'http://simpliahead.com/api/images/'

exports.getHtml = function (sender) {
    console.log("template", sender.name, sender.message)
    var html = `
    <div style="float:none;margin: 25px auto 0;width:800px;">
    <img src="${publicUrl}brand_logo.png" style='padding-bottom:15px;cursor:pointer;width:150px;'>
    <div style="border:1px solid #ddd;float:none;margin: 0 auto;width:800px;box-shadow:1px 0 5px grey;">
        <div style='width:800px;border-bottom:1px solid #ddd;text-align:center;height:100px;'>
            <img src="${publicUrl}Mail.png" style='width:85px;margin-top:20px;'>
        </div>
        <div style='width:800px;margin:0 auto;float:none;padding-top:40px;padding-bottom:40px;text-align:center;background-color:#fff;'>
        <p class="heading"> Hi <strong>`+ sender.name.toUpperCase() + `,</strong><b</p>
            <p style="padding-left:15px;padding-right:15px;">
            `+ sender.message + `
            </p>
            <div style='background:#000;height:55px;width:800px;margin:0 auto;'>
            <p style='font-size:14px;float:left;padding-left:15px;margin-top:20px;color:#fff;'>&copy; Simpliahead 2018 | All rights reserved.</p>
        </div>
</div>
</div>
</div>
    `;
    return html;
}

exports.welcomeMailToUser = function (sender, receiverEmail, receiverFullName) {
    console.log("template 2",sender)
    var html2 = `
    <div style="float:none;margin: 25px auto 0;width:800px;">
    <img src="${publicUrl}brand_logo.png" style='padding-bottom:15px;cursor:pointer;width:150px;'>
    <div style="border:1px solid #ddd;float:none;margin: 0 auto;width:800px;box-shadow:1px 0 5px grey;">
        <div style='width:800px;border-bottom:1px solid #ddd;text-align:center;height:100px;'>
            <img src="${publicUrl}Mail.png" style='width:85px;margin-top:20px;'>
        </div>
        <div style='width:800px;margin:0 auto;float:none;padding-top:40px;padding-bottom:40px;text-align:center;background-color:#fff;'>
        <p class="heading"> Hi <strong>`+ sender.name.toUpperCase() + `,</strong><b</p>
            <p style="padding-left:15px;padding-right:15px;">
            <div>
            <p>You have been successfully registered with
                <a href="http://simpliahead.com" style="text-decoration:none;color: lavenderblush;">Simpliahead.</a>
            </p>                  
            <p>Click the button below to Email Verification.</p>
            <a href="${sender.message}" styles="text-decoration: none;" target="_blank">
                <button styles="background-color: #3c8dbc;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;">
                Email Verification
                </button>
            </a>
        </div>
            </p>
            <div style='background:#000;height:55px;width:800px;margin:0 auto;'>
            <p style='font-size:14px;float:left;padding-left:15px;margin-top:20px;color:#fff;'>&copy; Simpliahead 2018 | All rights reserved.</p>
        </div>
</div>
</div>
</div>
`;
    return html2;
}
