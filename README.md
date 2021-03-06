# Automated Ticketing System

A web API for create parking, check-in to park, check-out to leave and show parking status for example available lot for
car by size (small, medium and large)

# Environments

```text
AUTO_TICKET_SYSTEM_DB_HOST
AUTO_TICKET_SYSTEM_DB_USER
AUTO_TICKET_SYSTEM_DB_PASS
AUTO_TICKET_SYSTEM_DB_PORT
AUTO_TICKET_SYSTEM_DB_NAME
```

# Scripts

```shell
# Start stack
docker-compose up

# Start development
yarn start:dev

# Unit test
yarn test

# Coverage test
yarn test:cov
```
# Assumption
## Annotation
![](annotation.png)

## Condition
![](condition-1.png)
- Parking lot has unique Lat and Long
- Gate / Automatic Ticket Machine has Lat 0 and Long 0
- Any car will to parking must check in at the Gate
- A car size S use 1 parking lot
- A car size M use 2 parking lot
- A car size L use 3 parking lot
- The automatic ticket machine will create a ticket and select short distance parking lot for your car size (see Example 1)
- When car leave parking lot then parking lot will available for next car
- Have a few available parking lot but no slot support that car size the ticket machine will not create a ticket (see Example 2) 

### Example 1
Parking lot Lat 1, Long 1 unavailable. Next, A car size M come to park that the ticket machine will create a ticket and select parking lot Lat 0 Long 2 and Lat 1 Long 2 for this car

![](example-1.png)

### Example 2
Parking lot (0,1), (1,2) and (2,3) unavailable. Next, A car size L come to park. the ticket machine will not create a ticket

![](example-2.png)

# Getting Started
**1.** Start Automated Ticketing System with ``docker-compose up --build``

**2.** Import Postman collection with [postman_auto-ticket-system.json](postman_auto-ticket-system.json)

**3.** Create parking lot area by POST request to http://auto-ticket-system-api/parking-lot-stage with body JSON like this

```text
{ 
  "size": "3" # 3, 4, square3
}
```

or use postman collection: _Create parking lot_

**Example create parking lot**

```text
# size square3
{
    "parkingLotId": [
        "606843614bb6ea001e7acc3e",
        "606843614bb6ea001e7acc3f",
        "606843614bb6ea001e7acc40",
        "606843614bb6ea001e7acc41",
        "606843614bb6ea001e7acc42",
        "606843614bb6ea001e7acc43",
        "606843614bb6ea001e7acc45",
        "606843614bb6ea001e7acc44",
        "606843614bb6ea001e7acc46"
    ]
}
```

**4.** Create ticket by POST request to http://auto-ticket-system-api/ticket with JSON body like this

```text
{
  "size": "s" # s, m, l
}
```
or use postman collection: _Create ticket_

**Example create ticket response**
```text
# Car size M create ticket
{
    "ticketId": "606843664bb6ea001e7acc47",
    "yourSlot": [
        "A-1",
        "A-2"
    ]
}
```

**5.** Leave parking lot by PUT request to http://auto-ticket-system-api/ticket/leave/your-ticket-id or use postman collection: _Leave parking lot_

**Example leave parking lot response**
```text
{
    "message": "Thank you for coming"
}
```

**6.** Get parking lot status by GET request to http://auto-ticket-system-api/parking-lot-stage/status or use postman collection: _Get parking lot status_. Example response

```text
{
    "subject": "Parking lot status",
    "capacity": 9, // parking lot size
    "parking": {
        "small": 1, // total car size S parking
        "medium": 2, // total car size m parking
        "large": 0, // total car size L parking
        "total": 3 // count all car parking
    },
    "available": {
        "small": 4, // available parking lot for car size S from available slot
        "medium": 1, // available parking lot for car size M from available slot
        "large": 1 // available parking lot for car size L from available slot
    }
}
```

**7.** Search licence plate by car size by GET request with query size (s, m, l, all) to http://auto-ticket-system-api/report/licence-plate or use postman collection: _Search licence plate by car size_

```text
# s, m, l, all (default)
?size=s
```
**Example search licence plate response**

```text
{
    "subject": "Licence plate by car size S",
    "licencePlateList": [
        "L-67AA",
        "L-26AA"
    ]
}
```

**8.** Get parking lot available by car size by GET quest with query size (s, m, l) to http://auto-ticket-system-api/slot/available or use postman collection: _Get parking slot available_

```text
# s, m, l, all (default)
?size=s
```

**Example get parking lot available by car size**

```text
# query size s
{
    "subject": "Available parking lot for car size S",
    "slot": {
        "small": 5
    }
}

# no query size
{
    "subject": "Available parking lot for car size ALL",
    "slot": {
        "small": 5,
        "medium": 1,
        "large": 1
    }
}
```
