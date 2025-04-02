import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../Redux/store';
import { performAttack, performFlee, applyFightResults } from '../../Redux/fightSlice';
import { IGame, ITeam, IUser } from '../../Types/Game'; // Import IGame, ITeam, IUser
import { updateTeamMembers } from '../../Redux/Slices/Game'; // Import the new action
// import ParticipantDisplay from './ParticipantDisplay'; // We'll create this soon
// import CombatLog from './CombatLog'; // We'll create this soon
// import ActionMenu from './ActionMenu'; // We'll create this soon

// TODO: Define how to update the main game state after the fight
// This might involve dispatching an action from your gameSlice
// e.g., import { updateTeamMembers } from '../../Redux/Slices/Game';

const FightScene: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    // Select all necessary state from Redux at the top level
    const {
        isActive,
        participantsTeam1,
        participantsTeam2,
        turnOrder,
        currentTurnIndex,
        combatLog,
        outcome,
        originalTeam1Name,
        originalTeam2Name,
        team1Id,
        team2Id,
        turnCount 
    } = useSelector((state: RootState) => state.fight);

    const game: IGame = useSelector((state: RootState) => state.game);
    const playerTeamId = team1Id;
    // const userTeamId = game.teams.find((t: ITeam) => t.members.some((m: IUser) => m.id === 'PLAYER_ID'))?.id;

    // Derive current participant state at the top level
    const currentParticipantId = isActive ? turnOrder[currentTurnIndex] : null;
    const getParticipant = (id: string): IUser | undefined => [...participantsTeam1, ...participantsTeam2].find((p: IUser) => p.id === id);
    const currentParticipant = currentParticipantId ? getParticipant(currentParticipantId) : null;
    const isPlayerTurn = currentParticipantId && participantsTeam1.some((p: IUser) => p.id === currentParticipantId);
    const canFlee = turnCount >= 3; // Calculate flee condition directly

    // Top-level useEffect for AI actions
    useEffect(() => {
        if (isActive && currentParticipantId && !isPlayerTurn && currentParticipant && currentParticipant.hp > 0) {
            const opponentTargets = participantsTeam1.filter((p: IUser) => p.hp > 0);
            const aiTargetId = opponentTargets.length > 0 ? opponentTargets[0].id : null;

            if (aiTargetId) {
                console.log(`AI ${currentParticipant.name} deciding action against ${aiTargetId}`);
                const timer = setTimeout(() => {
                    if(isActive) { 
                        dispatch(performAttack({ attackerId: currentParticipantId, defenderId: aiTargetId }));
                    }
                }, 1000); 
                return () => clearTimeout(timer);
            } else {
                 console.error("AI turn: No targets found, but fight is active?");
            }
        }
    }, [isActive, currentParticipantId, isPlayerTurn, participantsTeam1, dispatch, currentParticipant]); // Now currentParticipant is defined

    // Top-level useEffect for handling fight conclusion
    useEffect(() => {
        if (outcome && !isActive) {
            console.log('Fight ended!', outcome);
            if (team1Id) {
                console.log(`Updating team ${team1Id} state...`);
                dispatch(updateTeamMembers({ teamId: team1Id, updatedMembers: participantsTeam1 }));
            }
            if (team2Id) {
                 console.log(`Updating team ${team2Id} state...`);
                dispatch(updateTeamMembers({ teamId: team2Id, updatedMembers: participantsTeam2 }));
            }
            alert(`Fight Over: ${outcome.reason}`); 
            dispatch(applyFightResults());
        }
    }, [outcome, isActive, dispatch, participantsTeam1, participantsTeam2, team1Id, team2Id]);


    if (!isActive && !outcome) {
        // If fight isn't active and hasn't just ended, render nothing
        return null;
    }
    if(!isActive && outcome) {
        // If fight just ended, maybe show a brief summary or just null
        // The useEffect above handles the state cleanup
        return <div style={{ border: '2px solid green', padding: '10px', margin: '10px' }}>Applying fight results... {outcome.reason}</div>; // Simple persistent message until state resets
    }

    // --- Render Functions (No hooks inside these) --- 
    const renderParticipant = (p: IUser) => (
        <div key={p.id} style={{ border: '1px solid grey', margin: '5px', padding: '5px', opacity: p.hp <= 0 ? 0.5 : 1 }}>
            <strong>{p.name}</strong> (HP: {p.hp}, Atk: {p.stats.attack}) {p.id === currentParticipantId ? '<-- Turn' : ''}
        </div>
    );

    const renderCombatLog = () => (
        <div style={{ height: '200px', overflowY: 'scroll', border: '1px solid black', margin: '10px 0', padding: '5px' }}>
            {combatLog.map((line, index) => (
                <p key={index} style={{ margin: '2px 0', fontSize: '0.9em' }}>{line}</p>
            ))}
        </div>
    );

    // This function now only renders UI, doesn't call hooks
    const renderActionMenu = () => {
         if (!currentParticipant || currentParticipant.hp <= 0) {
             // If current participant is defeated, show waiting message
             return <div>Waiting for next turn...</div>;
         }

         // If it's AI turn, show thinking message (AI action triggered by top-level useEffect)
         if (!isPlayerTurn) {
             return <div>{currentParticipant.name} is thinking...</div>;
         } 
         
         // --- Player Action Menu ---
         const potentialTargets = participantsTeam2.filter((p: IUser) => p.hp > 0);
         const targetId = potentialTargets.length > 0 ? potentialTargets[0].id : null;
         const canAttack = targetId !== null;
         const targetParticipant = targetId ? getParticipant(targetId) : null;

         return (
            <div style={{ marginTop: '10px' }}>
                <h4>{currentParticipant.name}'s Actions:</h4>
                <button 
                    onClick={() => targetId && dispatch(performAttack({ attackerId: currentParticipantId!, defenderId: targetId }))}
                    disabled={!canAttack}
                    title={canAttack ? `Attack ${targetParticipant?.name} (HP: ${targetParticipant?.hp})` : 'No targets available'}
                    style={{ marginRight: '5px' }}
                >
                    Attack {canAttack ? targetParticipant?.name : ''}
                </button>
                <button 
                    onClick={() => dispatch(performFlee({ actorId: currentParticipantId! }))}
                    disabled={!canFlee} // Use top-level canFlee variable
                    title={canFlee ? 'Attempt to flee' : 'Cannot flee yet (Turn < 3)'}
                >
                    Flee
                </button>
            </div>
         );
    };
    // --- End of placeholder components ---


    return (
        <div style={{ border: '2px solid red', padding: '10px', margin: '10px', fontFamily: 'sans-serif' }}>
            <h2>Fight!</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
                <div>
                    <h3>{originalTeam1Name || 'Team 1'} (Player)</h3>
                    {participantsTeam1.map(renderParticipant)}
                </div>
                <div>
                    <h3>{originalTeam2Name || 'Team 2'} (Opponent)</h3>
                    {participantsTeam2.map(renderParticipant)}
                </div>
            </div>

            {renderCombatLog()} 
            
            {/* Render action menu or status text */} 
            {renderActionMenu()}

        </div>
    );
};

export default FightScene; 