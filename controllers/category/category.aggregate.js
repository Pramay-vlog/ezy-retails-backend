module.exports = {

    CATEGORY: [
        {
            '$lookup': {
                'from': 'Subcategory',
                'localField': '_id',
                'foreignField': 'categoryId',
                'as': 'subcategories',
                'pipeline': [
                    {
                        '$match': {
                            'isActive': true
                        }
                    }, {
                        '$project': {
                            '_id': 1,
                            'name': 1
                        }
                    }
                ]
            }
        }
    ]

}