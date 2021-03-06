function getCampaign() {
    let urlparams = null;
    let isGet = location.search.search('\\?');
    let mc_cid = null;
    let isMailchimp = false;

    var mc_eid = null;

    if (isGet !== -1) {
        urlparams = getUrlVars();
        urlparams.forEach(
            function (item) {
                if (item.key === 'utm_source') {
                    let reg = /^mailchimp$/;

                    if (reg.exec(item.value)) {
                        isMailchimp = true;
                    }
                } else {
                    if (item.key === 'mc_cid') {
                        mc_cid = item.value;
                    }

                    if (item.key == 'mc_eid') {
                        mc_eid = item.value;
                    }
                }
            }
        );
    } else {
        urlparams = location.href.split('/');
        let utmIndex = $.inArray('utm_source', urlparams);
        let mccidIndex = $.inArray('mc_cid', urlparams);
        let mceidIndex = $.inArray('mc_eid', urlparams);

        if (utmIndex !== -1) {
            let value = urlparams[utmIndex + 1];
            let reg = /^mailchimp$/;

            if (reg.exec(value)) {
                isMailchimp = true;
            }
        } else {
            if (mccidIndex !== -1) {
                mc_cid = urlparams[mccidIndex + 1];
            }

            if (mceidIndex !== -1) {
                mc_eid = urlparams[mceidIndex + 1];
            }

        }
    }

    if (mc_cid && !isMailchimp) {
        Mage.Cookies.clear('mailchimp_campaign_id');
        Mage.Cookies.set('mailchimp_campaign_id', mc_cid);
    }

    if (mc_eid) {
        Mage.Cookies.set('mailchimp_email_id', mc_eid);
    }

    let landingPage = Mage.Cookies.get('mailchimp_landing_page');

    if (!landingPage) {
        Mage.Cookies.set('mailchimp_landing_page', location);
    }

    if (isMailchimp) {
        Mage.Cookies.clear('mailchimp_campaign_id');
        Mage.Cookies.set('mailchimp_landing_page', location);
    }
}

function getUrlVars() {
    let vars = [];
    let i = 0;
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[i] = {'value': value, 'key': key};
            i++;
        }
    );
    return vars;
}

if (document.loaded) {
    getCampaign();
} else {
    document.observe('dom:loaded', getCampaign);
}
