/**
 * Terminal Command Tests — Vitest + jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { executeTerminalCommand } from '../js/apps/terminal.js';

describe('Terminal Commands', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="terminal-output"></div>';
    });

    it('should export executeTerminalCommand', () => {
        expect(typeof executeTerminalCommand).toBe('function');
    });

    it('should return empty string for empty input', () => {
        expect(executeTerminalCommand('')).toBe('');
        expect(executeTerminalCommand('   ')).toBe('');
    });

    it('should return "Command not found" for unknown commands', () => {
        const result = executeTerminalCommand('foobar');
        expect(result).toContain('Command not found');
    });

    it('help should return available commands', () => {
        const result = executeTerminalCommand('help');
        expect(result).toContain('Available commands');
        expect(result).toContain('ls');
        expect(result).toContain('cat');
    });

    it('pwd should return current path', () => {
        const result = executeTerminalCommand('pwd');
        expect(result).toContain('/home/sawyehtet');
    });

    it('whoami should return portfolio owner info', () => {
        const result = executeTerminalCommand('whoami');
        expect(result).toContain('Saw Ye Htet');
    });

    it('echo should return its arguments', () => {
        expect(executeTerminalCommand('echo hello world')).toBe('hello world');
    });

    it('date should return a date string', () => {
        const result = executeTerminalCommand('date');
        expect(result.length).toBeGreaterThan(0);
    });

    it('ls should list files in current directory', () => {
        const result = executeTerminalCommand('ls');
        expect(result).toBeTruthy();
    });

    it('cat on non-existent file should error', () => {
        const result = executeTerminalCommand('cat nonexistent.txt');
        expect(result).toContain('No such file or directory');
    });

    it('cd to non-existent dir should error', () => {
        const result = executeTerminalCommand('cd /fake/path');
        expect(result).toContain('No such file or directory');
    });

    it('neofetch should return ASCII art', () => {
        const result = executeTerminalCommand('neofetch');
        expect(result).toContain('sawyehtet@fedora');
    });

    it('sudo should return a cheeky response', () => {
        const result = executeTerminalCommand('sudo');
        expect(result).toContain('Nice try');
    });

    it('clear should empty terminal output', () => {
        const result = executeTerminalCommand('clear');
        expect(result).toBe('');
    });

    it('unknown commands should return Command not found', () => {
        expect(executeTerminalCommand('history')).toContain('Command not found');
        expect(executeTerminalCommand('ping example.com')).toContain('Command not found');
        expect(executeTerminalCommand('vim')).toContain('Command not found');
        expect(executeTerminalCommand('wget')).toContain('Command not found');
        expect(executeTerminalCommand('curl')).toContain('Command not found');
    });

    it('cowsay should draw a cow', () => {
        const result = executeTerminalCommand('cowsay hello');
        expect(result).toContain('(oo)');
        expect(result).toContain('hello');
    });

    it('flip should return table flip', () => {
        expect(executeTerminalCommand('flip')).toContain('╯');
    });

    it('unflip should return table unflip', () => {
        expect(executeTerminalCommand('unflip')).toContain('┬─┬');
    });

    it('fortune should return a random fortune', () => {
        const result = executeTerminalCommand('fortune');
        expect(result.length).toBeGreaterThan(0);
    });

    it('touch should create a file', () => {
        const result = executeTerminalCommand('touch newfile.txt');
        expect(result).toContain('Created file');
    });

    it('mkdir should create a directory', () => {
        const result = executeTerminalCommand('mkdir newdir');
        expect(result).toContain('Created directory');
    });
});
