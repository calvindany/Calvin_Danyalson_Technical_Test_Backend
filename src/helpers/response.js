const GenerateResponse = (httpStatus, message, data, error) => {
    const res = {
        status: httpStatus,
        message: message,
        data: data,
        error: error
    }

    return res;
}

const GenerateLeadsMappingData = (data) => {
    const restructureData = data.reduce((acc, row) => {
        const leadId = row.pk_tr_lead;

        console.log(leadId)
        if (!acc[leadId]) {
            acc[leadId] = {
                pk_tr_lead: row.pk_tr_lead,
                client_email: row.client_email,
                client_phone_number: row.client_phone_number,
                follow_ups: []
            };
        }

        if(row.follow_up) {
            acc[leadId].follow_ups.push({
                pk_tr_follow_up: row.follow_up.pk_tr_follow_up,
                follow_up_message: row.follow_up.follow_up_message,
                follow_up_result: row.follow_up.follow_up_result,
                created_at: row.follow_up.created_at
            });
        }

        return acc;
    }, {});

    // Convert the restructured data (object with lead IDs as keys) to an array
    const finalResult = Object.values(restructureData);

    return finalResult
}

module.exports = {
    GenerateResponse,
    GenerateLeadsMappingData
}