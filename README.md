# AltioraBot

## Polls
All commands have to start with a caret `^` and have to be in the first line of the message. Any text that the user wants to add has to be in another line.

```
^autopoll -timer 10m -reminder 2m 30s -ping @role @mention
Vote if you want X
```

`^autopoll` will react with a checkmark, cross and question mark.

The specified times are always a number followed by `h`, `m` or `s` for hour, minutes and seconds, respectively. `1h45m2s` would then stand for 1 hour, 45 minutes and 2 seconds.

`-timer` sets an end to the poll. After the specified time the bot will ping the poll creator and all pings (if specified) with the option that won or in case of a tie it will list the options that tied. `-timer 20m30s` will end the poll in 20 minutes and 30 seconds.

`-reminder` takes an arbitrary amount of times and will remind the poll creator and all pings (if specified) how much time is still left for the poll. `-reminder 30s 10m` will send a reminder 30 seconds and 10 minutes before the poll ends.

`-ping` takes an arbitrary amount of role and user mentions and will ping them when the poll ends or a reminder is sent.


```
^autovote
Vote if you want X
```

`^autovote` will react with an upvote and downvote.


```
^autoschedule
Vote on which weekdays you have time for scrim
```

`^autoschedule` will react with an the seven weekdays starting with Monday.


```
^autorolepoll
React with your role
```

`^autorolepoll` will react with an MT, OT, HS, Proj, FS and MS.

