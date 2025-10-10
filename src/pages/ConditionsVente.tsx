
import React from 'react'
import {FileText, Shield, Truck, RefreshCw} from 'lucide-react'

/**
 * Page des conditions générales de vente
 */
const ConditionsVente: React.FC = () => {
  const sections = [
    { id: 'article1', titre: 'Article 1 - Objet et champ d\'application' },
    { id: 'article2', titre: 'Article 2 - Produits et services' },
    { id: 'article3', titre: 'Article 3 - Prix et modalités de paiement' },
    { id: 'article4', titre: 'Article 4 - Livraison' },
    { id: 'article5', titre: 'Article 5 - Droit de rétractation' },
    { id: 'article6', titre: 'Article 6 - Garanties' },
    { id: 'article7', titre: 'Article 7 - Responsabilité' },
    { id: 'article8', titre: 'Article 8 - Propriété intellectuelle' },
    { id: 'article9', titre: 'Article 9 - Protection des données' },
    { id: 'article10', titre: 'Article 10 - Droit applicable' }
  ]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen pt-16">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 backdrop-blur-sm py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Conditions Générales de Vente
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Conditions applicables à toute commande passée sur MOONLINE ART
          </p>
          <p className="text-sm text-gray-300 mt-4">
            Dernière mise à jour : 15 janvier 2025
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation des sections */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <FileText className="mr-2 text-purple-400" size={20} />
                Sommaire
              </h3>
              <nav className="space-y-2">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="block w-full text-left text-sm text-gray-300 hover:text-purple-300 py-2 px-3 rounded-lg hover:bg-slate-700/30 transition-colors"
                  >
                    {section.titre}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Contenu des conditions */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Informations importantes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-900/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 text-center">
                <Shield className="mx-auto mb-3 text-blue-400" size={32} />
                <h3 className="text-white font-semibold mb-2">Paiement sécurisé</h3>
                <p className="text-gray-300 text-sm">Transactions protégées SSL</p>
              </div>
              
              <div className="bg-green-900/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/20 text-center">
                <Truck className="mx-auto mb-3 text-green-400" size={32} />
                <h3 className="text-white font-semibold mb-2">Livraison rapide</h3>
                <p className="text-gray-300 text-sm">3-7 jours ouvrés</p>
              </div>
              
              <div className="bg-purple-900/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 text-center">
                <RefreshCw className="mx-auto mb-3 text-purple-400" size={32} />
                <h3 className="text-white font-semibold mb-2">Retour 14 jours</h3>
                <p className="text-gray-300 text-sm">Satisfait ou remboursé</p>
              </div>
            </div>

            {/* Articles des CGV */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20">
              
              <section id="article1" className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Article 1 - Objet et champ d'application</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Les présentes conditions générales de vente (CGV) s'appliquent à toutes les commandes passées sur le site MOONLINE ART, 
                    exploité par [Nom de l'entreprise], société [forme juridique] au capital de [montant], 
                    immatriculée au RCS de [ville] sous le numéro [numéro].
                  </p>
                  <p>
                    Toute commande implique l'acceptation sans réserve des présentes conditions générales de vente qui prévalent 
                    sur toutes autres conditions générales ou particulières non expressément agréées par nos soins.
                  </p>
                </div>
              </section>

              <section id="article2" className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Article 2 - Produits et services</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    MOONLINE ART propose à la vente :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Œuvres d'art originales et reproductions sur toile</li>
                    <li>Accessoires et vêtements personnalisés à thème spatial</li>
                    <li>Services de création personnalisée sur commande</li>
                  </ul>
                  <p>
                    Les photographies et descriptions des produits présentés sur le site sont aussi fidèles que possible 
                    mais n'engagent pas la responsabilité du vendeur. Les couleurs peuvent légèrement varier en fonction 
                    des écrans et de leur calibrage.
                  </p>
                </div>
              </section>

              <section id="article3" className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Article 3 - Prix et modalités de paiement</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Les prix sont indiqués en euros toutes taxes comprises (TTC), hors frais de livraison. 
                    Ils sont valables pour la durée de leur affichage sur le site, sous réserve de disponibilité des produits.
                  </p>
                  <p>
                    Le paiement s'effectue :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Par carte bancaire (Visa, Mastercard, American Express)</li>
                    <li>Par PayPal</li>
                    <li>Par virement bancaire pour les commandes importantes</li>
                    <li>Paiement en plusieurs fois possible dès 100€ d'achat</li>
                  </ul>
                  <p>
                    La commande sera validée après encaissement effectif du règlement.
                  </p>
                </div>
              </section>

              <section id="article4" className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Article 4 - Livraison</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Les livraisons sont effectuées à l'adresse indiquée lors de la commande. Les délais de livraison sont :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>3-7 jours ouvrés pour les produits en stock (France métropolitaine)</li>
                    <li>2-4 semaines pour les créations personnalisées</li>
                    <li>Livraison gratuite dès 50€ d'achat</li>
                  </ul>
                  <p>
                    En cas de retard de livraison, le client sera informé par email. 
                    Les œuvres fragiles sont emballées avec un soin particulier pour garantir leur intégrité.
                  </p>
                </div>
              </section>

              <section id="article5" className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Article 5 - Droit de rétractation</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Conformément à l'article L.121-21 du Code de la consommation, vous disposez d'un délai de 14 jours 
                    à compter de la réception de votre commande pour exercer votre droit de rétractation.
                  </p>
                  <p>
                    <strong>Exceptions :</strong> Les créations personnalisées et sur-mesure ne peuvent faire l'objet 
                    d'une rétractation, conformément à l'article L.121-21-8 du Code de la consommation.
                  </p>
                  <p>
                    Les produits doivent être retournés dans leur état d'origine, avec leur emballage. 
                    Les frais de retour sont à la charge du client, sauf en cas de produit défectueux.
                  </p>
                </div>
              </section>

              <section id="article6" className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Article 6 - Garanties</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Tous nos produits bénéficient de la garantie légale de conformité et de la garantie contre les vices cachés.
                  </p>
                  <p>
                    MOONLINE ART s'engage à :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Utiliser des matériaux de qualité supérieure</li>
                    <li>Contrôler la qualité avant expédition</li>
                    <li>Remplacer ou rembourser tout produit défectueux</li>
                  </ul>
                </div>
              </section>

              <section id="article7" className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Article 7 - Responsabilité</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    La responsabilité de MOONLINE ART ne saurait être engagée pour tous les inconvénients ou dommages 
                    inhérents à l'utilisation du réseau Internet, notamment une rupture de service, une intrusion extérieure 
                    ou la présence de virus informatiques.
                  </p>
                  <p>
                    En cas de force majeure, MOONLINE ART se réserve le droit de reporter ou d'annuler toute commande.
                  </p>
                </div>
              </section>

              <section id="article8" className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Article 8 - Propriété intellectuelle</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Tous les éléments du site MOONLINE ART sont et restent la propriété intellectuelle et exclusive de la société. 
                    Toute reproduction, exploitation, rediffusion ou utilisation des créations, même partielle, 
                    est interdite sans autorisation écrite préalable.
                  </p>
                  <p>
                    L'achat d'une œuvre ne confère à l'acquéreur que la propriété matérielle de l'objet, 
                    et non les droits de reproduction ou d'exploitation commerciale.
                  </p>
                </div>
              </section>

              <section id="article9" className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Article 9 - Protection des données personnelles</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Conformément au RGPD, vos données personnelles sont collectées et traitées uniquement pour :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Le traitement de vos commandes</li>
                    <li>L'amélioration de nos services</li>
                    <li>L'envoi d'informations commerciales (avec votre accord)</li>
                  </ul>
                  <p>
                    Vous disposez d'un droit d'accès, de rectification et de suppression de vos données. 
                    Pour exercer ces droits, contactez-nous à : contact@moonlineart.com
                  </p>
                </div>
              </section>

              <section id="article10" className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Article 10 - Droit applicable et litiges</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Les présentes conditions générales de vente sont soumises à la loi française. 
                    En cas de litige, les tribunaux français seront seuls compétents.
                  </p>
                  <p>
                    Avant tout recours contentieux, nous privilégions un règlement amiable. 
                    Vous pouvez nous contacter à : contact@moonlineart.com ou par courrier postal.
                  </p>
                  <p>
                    En cas d'échec de la résolution amiable, vous pouvez recourir à la médiation de la consommation 
                    via la plateforme officielle : <a href="https://www.economie.gouv.fr/mediation-conso" className="text-purple-300 hover:text-purple-200">
                      www.economie.gouv.fr/mediation-conso
                    </a>
                  </p>
                </div>
              </section>

            </div>

            {/* Contact pour questions */}
            <div className="bg-purple-900/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold text-white mb-4">Questions sur nos conditions ?</h3>
              <p className="text-gray-300 mb-4">
                Notre équipe est à votre disposition pour répondre à toutes vos questions concernant nos conditions générales de vente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                >
                  Nous contacter
                </a>
                <a
                  href="mailto:contact@moonlineart.com"
                  className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                >
                  Email direct
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConditionsVente
