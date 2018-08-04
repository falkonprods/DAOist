# Token details

[Official OST documentation](https://dev.ost.com/docs/api_token.html)

Send a GET request to `/token` to receive information about the VIN token

### JSON Response Object

| Parameter | Type | Description |
| --- | --- | --- |
| name | string	| name of the token |
| symbol | string	| name of the symbol |
| symbol_icon	| string | icon reference |
| conversion_factor	| string [float] | conversion factor of the branded token to OST |
| total_supply | string [number] | Total supply of Branded Tokens |
| ost_value_balance	| string [number] | OST⍺ amount ropsten |
| ost_utility_balance	| array	| OST⍺ on utility chains with chain IDs and amounts as an array of tuples (3, amount) |
| price_points | object	| Contains the OST price point in USD and the Branded Tokens price point in USD |

#### Example Success Response

```json
{
  "token": {
    "name": "Vincoin",
    "symbol": "VIN",
    "symbol_icon": "token_icon_4",
    "conversion_factor": "14.86660",
    "total_supply": "92701.9999941",
    "ost_utility_balance": [["198", "87.982677084999999996"]],
  },
  "price_points": {
    "OST": {
      "USD": "0.177892",
    },
  },
}
```

#### Example Error Response

```json
{
  "code": "UNAUTHORIZED",
  "msg": "We could not authenticate the request. Please review your credentials and authentication method.",
  "error_data": [ ],
  "internal_id": "a_1"
}
```
