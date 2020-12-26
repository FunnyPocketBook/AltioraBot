# AltioraBot

## Polls
All commands have to start with a tiny mountain (caret) `^` and have to be in the first line of the message. Any text that the user wants to add should be in another line. I don't know what happens when it's in the same line - should still work but it might break some stuff as well.

### Commands

```
^autopoll
Vote if you want X
```

`^autopoll` will react with a checkmark, cross and question mark.




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

### Options
All options can be used in conjunction with another, unless specified.

The specified times are always a number followed by `h`, `m` or `s` for hour, minutes and seconds, respectively. `1h45m2s` would then stand for 1 hour, 45 minutes and 2 seconds.

`-timer` sets an end to the poll. After the specified time the bot will ping the poll creator and all pings (if specified) with the option that won or in case of a tie it will list the options that tied. `-timer 20m30s` will end the poll in 20 minutes and 30 seconds. At the end of the timer the bot will reply to the poll with the outcome: No reactions, tie or emoji with the majority of the reactions. In the case of a tie or majority the corresponding emoji(s) will also be sent.

`-reminder` takes an arbitrary amount of times and will remind the poll creator and all pings (if specified) how much time is still left for the poll. `-reminder 30s 10m` will send a reminder 30 seconds and 10 minutes after the poll started. If `-timer` is also given as option, the reminder will come 30 seconds and 10 minutes before the poll ends.

`-ping` takes an arbitrary amount of role and user mentions and will ping them when the poll ends or a reminder is sent. `-ping @community @Maisbär` will ping `@community` and `@Maisbär`

`-custom` lets the user set custom emojis as reaction. This will override any of the above commands, so it doesn't matter which command you use. The custom reaction should be provided at the end of the message, each custom reaction is on its own line and *seperated by a space* from its descriptor. If `-timer` is also given as option, the corresponding emojis of the tie or majority will be replaced with the descriptor of the emoji.
```
^autovote -custom
:Altiora: Description of reaction
:flower: Description of reaction
```

`-message` lets the user specify a custom text for the majority reaction text. It takes a string wrapped in double quotes as an input (`"this will be the custom message"`). The use can also use `^r` in the message itself to use the majority reaction in the message itself. If `-custom` is also given as option, `^r` will use the descriptor of the majority emoji instead of the emoji itself.
```
^autoschedule -message "Scrim on ^r at 20 CET!"
```