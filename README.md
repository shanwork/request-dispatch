# request-dispatch
Sample pizzeria operation show casing Object Oriented JS and other features
The implementation is intended 
## Day to Day Activity
## Data collection for statisical analyses


## Phase 1 Day to Day Activity
   ## Data Model
   ### Reference / Static Data 
   #### Menu  
     let menu=  [
      { 
        level1Name: string
        level2: [ // some items do not need 
          { 
             level2Name: string
             items: [
                { 
                  itemName: string
                  Food type: [..]
                  ingredients: comma separated string - no need for array at this stage *
                  quantities 
                  [
                    { 
                      unit : string (e.g. 12 inch, 4 pcs, etc)
                      cost price: double,
                     preptime: ms
                    }
                 ]
               }, {... }...
             ] // Items
           }, {...}  // subcategories
         ]
        }, {....} ... 
      ]
     }
    
#### Order mode - telephonic, in person,  online  - reference data   
    
#### Food type - reference data
       one or more of 
       a. Vegan - pure veg, no milk
       b. Jain vegetarian - veg, milk possible, no onion or garlic
       c. Vegetarion - veg, no egg
       d. eggetarion - veg with egg
       e. piscetarion - veg with fish
       f. regular - beef
       g. regular - pork
       h. regular - other red meat
       i regular - poultry

#### Order status
       - order registered, order processing, order ready, order despatched, order delivered, order picked up
         order served

### Entry, Processing, Semistatic data

#### Delivery resources - reference data - the list remains constant, status changes
       Name,
       vehicle
       Status: despatched, break, buffer, available

#### Order queue
       Order Id
       Name,
       address,
       order - shopping cart reference to Menu
       payment info
       mode of deliverance - pick up, delivery, eat-in
       mode of order reference to Order Mode
       isDelivery 
       status - updated dynamically = reference from order status 
       timeOfOrder
       timeReady // later?
       timeOfDeliverance
       Notes 

## Activity

### Static/Semi static Data entry
      create flow later. Manual entry
### Place Order Page
      page will have two sections
 #### Chose item, and click 'Add'
      use the tree structure implemented for Roche!!!!
 #### Shopping cart. 
      Sort, search, edit quantity, delete
 * click Submit
 * Order gets added to order queue with status 'registered'
 * set interval to check status 
   
### Order Processing page
    Three sections
 #### Incoming orders
 #### Orders ready for deliverance
 #### Orders in various stages of deliverance

