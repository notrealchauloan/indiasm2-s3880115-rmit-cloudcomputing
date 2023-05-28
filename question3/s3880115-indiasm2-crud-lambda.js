const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    
    console.info("event data: " + JSON.stringify(event))
    
    switch (event.httpMethod + " " + event.resource) {
      
      
      //Delete a single item by id
      case "DELETE /items/{id}":
        await dynamo
          .delete({
            TableName: "s3880115-indiasm2-table-projects",
            Key: {
              "projectid": event.pathParameters.id
            }
          })
          .promise();
        body = `Successfully deleted item ${event.pathParameters.id}`;
        break;
        
      //Get a single item by id  
      case "GET /items/{id}":
        body = await dynamo
          .get({
            TableName: "s3880115-indiasm2-table-projects",
            Key: {
              "projectid": event.pathParameters.id
            }
          })
          .promise();
        break;
        
      //Get all items in the table  
      case "GET /items":
        body = await dynamo.scan({ TableName: "s3880115-indiasm2-table-projects" }).promise();
        break;
        
      //Put a single item in the table  
      case "PUT /items":
        let requestJSON = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: "s3880115-indiasm2-table-projects",
            Item: {
              projectid: requestJSON.projectid,
              company: requestJSON.company,
              projecttitle: requestJSON.projecttitle,
              projectintroduction: requestJSON.projectintroduction,
              projectoutcomes: requestJSON.projectoutcomes,
              successcriteria: requestJSON.successcriteria,
              competencyrequired: requestJSON.competencyrequired,
              projectdescription: requestJSON.projectdescription,
              academicbackground: requestJSON.academicbackground,
              studentnum: requestJSON.studentnum,
              interviewedrequired: requestJSON.interviewedrequired,
              multiteams: requestJSON.multiteams,
              supervisor: requestJSON.supervisor,
              position: requestJSON.position,
              email: requestJSON.email
            }
          })
          .promise();
        body = `Successfully insert information for project ${requestJSON.projecttitle}`;
        break;
        
        
      //If no route found output message with all even   
      default:
        throw new Error(`Unsupported route: "${event.httpMethod + " " + event.resource + " - EVENT: " + JSON.stringify(event)}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};