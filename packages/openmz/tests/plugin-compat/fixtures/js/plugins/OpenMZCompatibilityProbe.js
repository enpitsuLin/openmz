/*:
 * @target MZ
 * @plugindesc Counts player steps and sets a switch through a plugin command.
 * @param stepVariable
 * @type variable
 * @command setSwitch
 * @arg switchId
 * @type switch
 */
(() => {
  const name = 'OpenMZCompatibilityProbe';
  const stepVariable = Number(PluginManager.parameters(name).stepVariable);
  const increaseSteps = Game_Player.prototype.increaseSteps;

  Game_Player.prototype.increaseSteps = function() {
    increaseSteps.call(this);
    $gameVariables.setValue(stepVariable, $gameVariables.value(stepVariable) + 1);
  };

  PluginManager.registerCommand(name, 'setSwitch', function({ switchId }) {
    $gameSwitches.setValue(Number(switchId), this instanceof Game_Interpreter);
  });
})();
