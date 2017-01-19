autoMate offerings

localhost:4000/videoswap?
    newVideoURL ==>required, location where video to be swapped in is located. If video is located as an asset within the Jira ticket, just include the link for the Jira ticket
    oldVideoID  ==>required, id of content to be swapped out 
    ticketNum   ==>required, if associated with a ticket, it should be Jira ticket number, or unique identifier for log reference. 

localhost:4000/logs?
    _____       ==>required, this would be the Jira ticket number, or other uniqe identifier given to autoMate for logging purposes. At the end of every autoMate log, a permalink to that log is given.