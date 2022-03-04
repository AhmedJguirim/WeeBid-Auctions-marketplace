a = "Hello."
firstLetter = a[0] #premier charactere
lastCharacter = a[len(a)-1] #dernier charactere // len(a) ta3tina longeur de chaine weli howa 6 lel "hello." 
                            #mte3na , ema python yebda ye7seb mel 0 mouch mel 1 , so el index mta3 "." howa 5 weli howa 6-1 
if firstLetter.isupper()== True and lastCharacter==".":
    print("chaine valide")
else:
    print("chaine invalide")


a=153
chaine = str(a) 
somme = int(chaine[0])**3 + int(chaine[1])**3 + int(chaine[2])**3
if somme == a:
    print("entier cubiques")
else:
    print("entiers pas cubiques")


#facon 2 
b = 153
n1 = int((b/100))
n2 = ((b%100)-(b%10))/10
n3 = b%10
print(n1,n2,n3)
sum = n1**3 + n2**3 + n3**3
if sum == b:
    print("entier cubiques")
else:
    print("entiers pas cubiques")


mois = input("saisissez un mois")

if mois in ['avril' , 'juin' ,  'septembre' , 'novembre']:
    print("30 jours")
elif mois in ['janvier' , 'mars' , 'may' , 'juillet' , 'aout' , 'octobre' , 'decembre']:
    print("31 jours")
elif mois=='fevrier':
    print("28 ou 29 jours")
else:
    print("invalide")