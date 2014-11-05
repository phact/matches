var matches = function(){

    var matchGame = 
    {"ReadyPlayer": 1,
    "board":[
          {
            "bin":1,
            "value": 1
          },
          {
            "bin":2,
            "value": 2
          },
          {
            "bin":3,
            "value": 3
          },
          {
            "bin":4,
            "value": 4
          },
          {
            "bin":5,
            "value": 5
          }
        ]
    };

    matches.getLivePlayer = function(){
        console.log(matchGame.ReadyPlayer);
        return matchGame.ReadyPlayer;
    }

    matches.getState = function(bin){
        if (bin == undefined){
            console.log(JSON.stringify(matchGame));
            return JSON.stringify(matchGame);
        }
        bin = bin-1;
        if (bin > 4||bin==0){
            console.log("try a valid input");
            return false;
        }
        console.log(matchGame.board[bin].value);
        return matchGame.board[bin].value;
    }
    
    matches.getStateObject = function(){
        return matchGame;
    }
    
    matches.getFlatBoard = function(){
        var flatMatchBoard = [];
        var boardLength = matchGame.board.length;
        var counter = 0;
        for (var i=0;i<boardLength;i++){
            for (var j=0;j<matchGame.board[i].bin;j++){
                if (matchGame.board[i].value <= j){
                    flatMatchBoard[counter]={"bin":i+1,"value":undefined};
                } else{
                    flatMatchBoard[counter]={"bin":i+1,"value":j+1};
                }
                counter++;
            }
        }
        return flatMatchBoard;
    }
    var playerSwap = function(){
        if (matchGame.ReadyPlayer==1){
            matchGame.ReadyPlayer = 2;
        }else{
            matchGame.ReadyPlayer = 1;
        }
        $("#activePlayer").html("Ready Player "+matchGame.ReadyPlayer);
    }
    
    var checkWinner = function(){
        var winner = true;
        var ones = 0;
        $.each(matchGame.board, function( index, val ) { 
            if (val.value > 0){
                winner= false;
            }
        });
        if (winner){
            alert("Game over, player " +matches.getLivePlayer()+" is victorious!");
        }
        return winner;
    }
    
    matches.play = function(bin, quantity){
        if (checkWinner()){
            return;
        }
        bin--;
        if(matchGame.board[bin].value == 0 || quantity == undefined || quantity == 0){
            console.log("try again");
            return;
        }
        if(quantity>matchGame.board[bin].value){
            console.log("Illegal play, defaulting to max");
            quantity = matchGame.board[bin].value;
        }
        matchGame.board[bin].value = matchGame.board[bin].value-quantity;
        playerSwap();
        checkWinner();
        this.getState();
    }
    
}

var start = function (){
    matches();
    
    var activePile;
    var pulledMatchCount = 0;
    
    reDraw = function(){
        matchViz.selectAll("path").data(matches.getFlatBoard())
            .transition()
            .attr("transform" , function(d){
                if (d.value == undefined){
                    return "scale(0.25) translate(-"+padding+", 0)";
                }
                return "scale(0.25) translate("+((d.bin-1)*padding+((d.value-1)*padding/5))+", 0)";
            })
            .duration(1000);
        activePile = undefined;
        pulledMatchCount = 0;
    }
    
    makeMove = function(){
        if(activePile==undefined){
            console.log("can't play yet");
            return;
        }
        matches.play(activePile,pulledMatchCount);
        reDraw();
        pulledMatchCount= 0;
    }
    
    snatchMatch = function(myMatch, d){
        if(!(activePile==undefined || activePile == d.bin)){
            return;
        }
        d3.select(myMatch)
          .transition()
          .attr("transform" , function(d){
                return "scale(0.25) translate(-"+padding+", 0)";
            })
          .duration(1000);
        activePile = d.bin;
        pulledMatchCount++;
    }
    
    var width = $("#gameArea").width(),
        height = 300;
        
    var padding = width / 1.4;
        
    var matchViz = d3.select("#gameArea").append("svg")
        .attr("width", width)
        .attr("height", height);
    
    var ln = matchViz.append("linearGradient")
        .attr("id","matchLinearGradient")
        .attr("x1","0%")
        .attr("y1","0%")
        .attr("x2","0%")
        .attr("y2","100%");
        
     ln.append("stop")
            .attr("id","stop3047")
            .attr("offset","0")
            .style("stop-color","#ef2700")
            .attr("stop-opacity","0.47747749");
      
     ln.append("stop")
            .attr("id","stop3069")
            .attr("offset","0.222")
            .style("stop-color","#f35205")
            .attr("stop-opacity","0.13513513");
            
     ln.append("stop")
            .attr("id","stop3077")
            .attr("offset","0.222")
            .style("stop-color","#f3da8a")
            .attr("stop-opacity","0.81981981");
            
     ln.append("stop")
            .attr("id","stop3073")
            .attr("offset","1")
            .style("stop-color","#e9b22f")
            .attr("stop-opacity","0.52252251");

    
    matchViz.append("g").selectAll("path").data(matches.getFlatBoard()).enter().append("path")
            .style("background-color","blue")
            .attr("d", "m 306.00208,389.7941 0.50508,555.14126 65.71748,0 0,-554.71192 c 0,0 68.58921,-81.93592 28.58727,-118.54128 -40.00194,-36.60535 -89.2403,-32.83083 -128.59213,5.90941 -34.26123,43.98972 16.84197,73.24904 33.7823,112.20253 z")
            .attr("transform" , function(d){
                if (d.value == undefined){
                    return "scale(0.25) translate(-"+padding+", 0)";
                }
                return "scale(0.25) translate("+((d.bin-1)*padding+((d.value-1)*padding/5))+", 0)";
            })
            .attr("style", "fill:url(#matchLinearGradient);stroke:black;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;fill-opacity:1")
            .on("mouseover", function(d){
                d3.select(this)
                    .style("stroke", "gray")
                    .style("stroke-width", "10px");
            })
            .on("mouseout", function(d){
                d3.select(this)
                    .style("stroke", "black")
                    .style("stroke-width", "1px");
            })
            .on("click", function(d){
                snatchMatch(this, d);
            });

            
}
